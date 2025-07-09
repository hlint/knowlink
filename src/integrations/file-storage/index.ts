import { getFileExtension, shortId } from "@/lib/string";
import { LocalFileStorage } from "@mjackson/file-storage/local";

export const fileStorage = new LocalFileStorage("./runtime/upload");

export type SavedFileInfo = Awaited<ReturnType<typeof getFileInfo>>;

function getKey(filename: string) {
  return `${shortId()}.${getFileExtension(filename) || "data"}`;
}

export async function saveFile(file: File) {
  const key = getKey(file.name);
  await fileStorage.set(key, file);
  return getFileInfo(key);
}

export async function getFileInfo(key: string) {
  const fileSaved = await fileStorage.get(key);
  if (!fileSaved) {
    throw new Error("File not found");
  }
  const { size, type, name, lastModified } = fileSaved;
  return {
    key,
    url: `/upload/${key}`,
    size,
    type,
    name,
    lastModified,
  };
}
