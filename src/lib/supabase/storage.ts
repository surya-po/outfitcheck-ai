import { createClient } from "./server";

/**
 * Uploads a base64 encoded image to Supabase Storage and returns the public URL.
 * 
 * @param base64Str The base64 string (e.g. data:image/jpeg;base64,/9j/4AAQSk...)
 * @param bucket The Supabase Storage bucket name (e.g. 'scans')
 * @param path The file path inside the bucket (e.g. 'user_123/scan_456.jpg')
 * @returns The public URL of the uploaded image
 */
export async function uploadBase64Image(
  base64Str: string,
  bucket: string,
  path: string
): Promise<string> {
  const supabase = await createClient();

  // Extract base64 data and mime type
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid base64 string format");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  // Convert base64 to Buffer
  const buffer = Buffer.from(base64Data, "base64");

  // Upload to Supabase
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: mimeType,
      upsert: true,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  // Get public URL
   
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrlData.publicUrl;
}
