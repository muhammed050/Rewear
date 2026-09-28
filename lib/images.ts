import "server-only";
import sharp from "sharp";
import { adminDb } from "./supabase";
export async function cleanImage(file: File) {
  if (
    file.size > 4 * 1024 * 1024 ||
    !["image/jpeg", "image/png", "image/webp"].includes(file.type)
  )
    throw new Error("INVALID");
  const raw = Buffer.from(await file.arrayBuffer());
  const meta = await sharp(raw, { limitInputPixels: 24000000 }).metadata();
  if (!["jpeg", "png", "webp"].includes(meta.format || ""))
    throw new Error("INVALID");
  return sharp(raw, { limitInputPixels: 24000000 })
    .rotate()
    .resize(1400, 1400, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
}
export async function saveImage(userId: string, bucket: string, bytes: Buffer) {
  const path = `${userId}/${crypto.randomUUID()}.webp`;
  const { error } = await adminDb()
    .storage.from(bucket)
    .upload(path, bytes, { contentType: "image/webp" });
  if (error) throw error;
  return path;
}
export async function signedImage(bucket: string, path: string | null) {
  if (!path) return null;
  const { data } = await adminDb()
    .storage.from(bucket)
    .createSignedUrl(path, 900);
  return data?.signedUrl || null;
}
