/**
 * Cloudinary client for file uploads.
 * Replaces local disk storage (public/uploads/) with cloud storage.
 *
 * Environment variables:
 *   CLOUDINARY_CLOUD_NAME  - Cloudinary cloud name
 *   CLOUDINARY_API_KEY     - Cloudinary API key
 *   CLOUDINARY_API_SECRET  - Cloudinary API secret
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
}

/**
 * Upload a file buffer to Cloudinary.
 * @param buffer - File contents as Buffer
 * @param folder - Cloudinary folder (e.g. "models", "receipts")
 * @param fileName - Original file name for reference
 * @returns UploadResult with URL and public_id
 */
export async function uploadBuffer(
  buffer: Buffer,
  folder: string,
  fileName: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `3dmagza/${folder}`,
        public_id: `${Date.now()}-${crypto.randomUUID().split("-")[0]}`,
        resource_type: "auto",
        use_filename: true,
        unique_filename: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(new Error(error?.message || "Cloudinary upload failed"));
          return;
        }
        resolve({
          url: result.url,
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete a file from Cloudinary by public_id.
 */
export async function deleteFile(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

/**
 * Check if Cloudinary is configured.
 */
export function isCloudinaryConfigured(): boolean {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}
