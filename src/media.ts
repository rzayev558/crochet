import * as FileSystem from "expo-file-system/legacy";

const MEDIA_DIR = FileSystem.documentDirectory + "media/";

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(MEDIA_DIR);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(MEDIA_DIR, { intermediates: true });
  }
}

/**
 * Copy a picked file (image or document) out of the volatile cache into the
 * app's document directory so it survives app restarts. Returns the new uri.
 */
export async function persistFile(uri: string, fileName?: string): Promise<string> {
  await ensureDir();
  const guessedExt = fileName?.includes(".")
    ? fileName.slice(fileName.lastIndexOf("."))
    : uri.includes(".")
    ? uri.slice(uri.lastIndexOf("."))
    : "";
  const dest = `${MEDIA_DIR}${Date.now()}_${Math.round(Math.random() * 1e6)}${guessedExt}`;
  await FileSystem.copyAsync({ from: uri, to: dest });
  return dest;
}

/** Best-effort delete of a persisted media file. */
export async function deleteFile(uri?: string | null) {
  if (!uri || !uri.startsWith(FileSystem.documentDirectory ?? "")) return;
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch {
    // ignore
  }
}
