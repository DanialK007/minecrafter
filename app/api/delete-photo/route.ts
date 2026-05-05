import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export async function DELETE(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as
      | { publicId?: string }
      | null;

    const publicId = body?.publicId;
    if (!publicId) {
      return NextResponse.json(
        { error: "Missing publicId" },
        { status: 400 }
      );
    }

    const result = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,
    });

    // Cloudinary returns { result: "ok" | "not found" | ... }
    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Delete failed",
        reason: err?.message || String(err),
      },
      { status: 500 }
    );
  }
}

