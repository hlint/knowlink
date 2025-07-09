import { shortId } from "@/lib/string";
import mime from "mime";
import { saveFile } from ".";

export default async function remoteDownload(src: string) {
  if (src.startsWith("data:")) {
    return saveFileFromDataUrl(src);
  }
  return saveFileFromLink(src);
}

async function saveFileFromLink(link: string, timeout = 10 * 1000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(link, { signal: controller.signal });
    clearTimeout(timeoutId);
    const contentType = res.headers.get("content-type") || "text/plain";
    const ext = mime.getExtension(contentType) || ""; // like: txt
    const blob = await res.blob();
    const filename = `${shortId()}.${ext}`;
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const file = new File([buffer], filename, { type: contentType });
    return saveFile(file);
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function saveFileFromDataUrl(
  dataUrl: string, // like: data:image/png;base64,iVBORw0K...
) {
  const base64SearchText = ";base64,";
  const indexBase64SearchText = dataUrl.indexOf(base64SearchText);
  const indexSlash = dataUrl.indexOf("/");

  // src is not a base64 URL
  if (
    indexBase64SearchText === -1 ||
    indexSlash === -1 ||
    !dataUrl.startsWith("data:")
  ) {
    throw new Error("Invalid data URL");
  }

  // fileType is image, video, ect (first part of mime-type)
  // const fileType = src.substring('data:'.length, indexSlash);
  // fileEnding is second part of mime-type
  const fileEnding = dataUrl.substring(indexSlash + 1, indexBase64SearchText);
  // data is the raw base64-string. This is most likely what you want to use
  const data = dataUrl.substring(
    indexBase64SearchText + base64SearchText.length,
  );
  const buffer = Buffer.from(data, "base64");
  const filename = `${shortId()}.${fileEnding}`;
  const file = new File([buffer], filename, { type: fileEnding });
  return saveFile(file);
}
