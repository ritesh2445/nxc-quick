import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await context.params;
    const objectKey = key.join("/");

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME || "nxc-verse-storage";

    if (!accountId || !accessKeyId || !secretAccessKey) {
      return new NextResponse("Asset Storage Not Configured", { status: 404 });
    }

    const client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    });

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const response = await client.send(command);

    if (!response.Body) {
      return new NextResponse("Asset Not Found", { status: 404 });
    }

    const byteArray = await response.Body.transformToByteArray();

    return new NextResponse(byteArray as any, {
      status: 200,
      headers: {
        "Content-Type": response.ContentType || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": response.ETag || "",
      },
    });
  } catch (err: any) {
    return new NextResponse("Asset Not Found", { status: 404 });
  }
}
