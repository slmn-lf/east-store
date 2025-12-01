import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File tidak ditemukan" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<{ secure_url: string }>(
      (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "eaststore",
              transformation: [
                {
                  aspect_ratio: "1:1",
                  crop: "fill",
                  gravity: "auto",
                },
              ],
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else if (result && result.secure_url) {
                resolve({ secure_url: result.secure_url });
              } else {
                reject(new Error("No secure_url returned from Cloudinary"));
              }
            }
          )
          .end(buffer);
      }
    );

    console.log(`✅ Image uploaded to Cloudinary: ${result.secure_url}`);

    return NextResponse.json(
      { success: true, url: result.secure_url },
      { status: 200 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Upload error details:", errorMessage);
    return NextResponse.json(
      {
        success: false,
        message: "Upload gagal",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
