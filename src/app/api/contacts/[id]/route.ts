import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { deleteContact } from "@/lib/db/queries";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getCurrentUser();
    const userId = session?.user?.id || "usr_ritesh";

    await deleteContact(id, userId);
    return NextResponse.json({ success: true, message: "Contact deleted" });
  } catch (error) {
    console.error("[Contact DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
