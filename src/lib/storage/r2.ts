import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

// Allowed upload mime types and extensions
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export type AssetCategory = "profile" | "branding" | "cards" | "generated";

export interface UploadAssetParams {
  userId: string;
  category: AssetCategory;
  buffer: Buffer | Uint8Array;
  mimeType: string;
  originalFileName?: string;
}

export interface UploadAssetResult {
  key: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
}

// Initialize S3-compatible R2 Client
function getR2Client(): S3Client | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Centralized upload utility for Cloudflare R2
 */
export async function uploadAssetToR2({
  userId,
  category,
  buffer,
  mimeType,
}: UploadAssetParams): Promise<UploadAssetResult> {
  // 1. Validate MIME Type
  const extension = ALLOWED_MIME_TYPES[mimeType.toLowerCase()];
  if (!extension) {
    throw new Error(`Unsupported media type: ${mimeType}. Allowed: JPG, PNG, WEBP, SVG, PDF.`);
  }

  // 2. Validate File Size
  const sizeBytes = buffer.length;
  if (sizeBytes > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File exceeds maximum allowed size of 5MB (${(sizeBytes / 1024 / 1024).toFixed(2)}MB).`);
  }

  // 3. Generate Secure Namespaced Key (users/{userId}/{category}/{uuid}.{ext})
  const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  const objectKey = `users/${userId}/${category}/${uniqueId}.${extension}`;
  const bucketName = process.env.R2_BUCKET_NAME || "nxc-verse-storage";

  const client = getR2Client();

  if (client) {
    // Production / Live Cloudflare R2 Upload
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    await client.send(command);

    const publicDomain = process.env.R2_PUBLIC_DOMAIN;
    const url = publicDomain ? `${publicDomain.replace(/\/$/, "")}/${objectKey}` : `/api/assets/${objectKey}`;

    return {
      key: objectKey,
      url,
      mimeType,
      sizeBytes,
    };
  } else {
    // Local development fallback when R2 credentials are not configured in local environment
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUri = `data:${mimeType};base64,${base64}`;

    return {
      key: objectKey,
      url: dataUri,
      mimeType,
      sizeBytes,
    };
  }
}

/**
 * Securely deletes an asset from R2 with owner verification
 */
export async function deleteAssetFromR2(key: string, userId: string): Promise<boolean> {
  // Ownership verification check: key MUST start with users/{userId}/
  if (!key.startsWith(`users/${userId}/`)) {
    throw new Error("Unauthorized asset deletion attempt.");
  }

  const client = getR2Client();
  if (!client) return true;

  const bucketName = process.env.R2_BUCKET_NAME || "nxc-verse-storage";
  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    await client.send(command);
    return true;
  } catch (err) {
    console.error(`[R2] Failed to delete asset ${key}:`, err);
    return false;
  }
}
