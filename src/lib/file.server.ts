import path from "node:path";
import { saveFile } from "@/integrations/file-storage";
import fs from "fs-extra";
import { shortId } from "./string";

// Traverse directory
export async function deepDirScan(
  dir: string,
  _results: {
    absolutePath: string;
    relativePath: string;
    fileName: string;
    size: number;
  }[] = [],
  _relativePath = "",
) {
  const files = await fs.readdir(path.join(dir, _relativePath));
  for (const file of files) {
    const stats = await fs.stat(path.join(dir, _relativePath, file));
    const isDir = stats.isDirectory();
    if (isDir) {
      // Recursive call
      await deepDirScan(dir, _results, path.join(_relativePath, file));
    } else {
      // Record file
      _results.push({
        absolutePath: path.join(dir, _relativePath, file),
        relativePath: path.join(_relativePath, file),
        fileName: file,
        size: stats.size,
      });
    }
  }
  return _results;
}

export async function uploadFileByUrl(url: string) {
  const blob = await fetchWithMaxSize(url);
  const [category, ext] = blob.type.split("/");
  const file = new File([blob], `${shortId()}.${ext || category}`, {
    type: blob.type,
  });
  const fileSaved = await saveFile(file);
  return fileSaved;
}

async function fetchWithMaxSize(url: string, maxSize = 8 * 1024 * 1024) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }

  const contentLength = response.headers.get("content-length");
  if (contentLength && Number(contentLength) > maxSize) {
    throw new Error("Content too large");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Failed to get reader");
  }
  let received = 0;
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.length;
    if (received > maxSize) {
      reader.cancel();
      throw new Error("Content too large");
    }
    chunks.push(value);
  }
  return new Blob(chunks);
}
