import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_KEY!,
  api_secret: process.env.CLOUD_SECRET!,
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "uploads/", // same folder
      max_results: 100, // adjust as needed
      sort_by: [{ public_id: "desc" }], // newest first
    });

    const urls = result.resources.map(
      (r: { secure_url: string }) => r.secure_url
    );
    
    return NextResponse.json({ urls });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch photos", details: err }, { status: 500 });
  }
}