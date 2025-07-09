import { nanoid } from "nanoid";

export function shortId() {
  return nanoid(6);
}

export function getFileExtension(fileName: string) {
  // Use lastIndexOf() to find the position of the last "."
  const dotIndex = fileName.lastIndexOf(".");

  // If no "." is found, return an empty string
  if (dotIndex === -1) {
    return "";
  }

  // Extract the substring after the last "."
  return fileName.substring(dotIndex + 1);
}

/**
 * Fix relative links in the tag
 * @param src - The src attribute of the tag
 * @param baseUrl - The url of the page
 * @returns The fixed src attribute
 */
export function fixRelativeLinks(src: string, baseUrl: string) {
  const origin = new URL(baseUrl).origin;
  if (src.startsWith("#")) {
    return new URL(src, baseUrl).href;
  }
  // Check if src is a valid URL
  try {
    new URL(src, origin);
  } catch (_e) {
    return src;
  }
  try {
    // Check if src is already an absolute path
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src; // src is already an absolute path, return as is
    }

    // Extract the base part of href and calculate the absolute path based on src and base
    return new URL(src, baseUrl).href;
  } catch (_e) {
    return src;
  }
}

// Simulate Windows renaming: if there are duplicates, automatically add a number. ABC, ABC(1), ABC(2)...
export function autoRenameWithIndex(newName: string, localNames: string[]) {
  const reg = /([\w\W]*)\((\d+)\)$/;
  const r1 = reg.exec(newName);
  const pureName1 = r1?.[1] || newName;
  let maxIndex = 0;
  for (const t of localNames) {
    const r2 = reg.exec(t);
    const pureName2 = r2?.[1] || t;
    let index2 = 0;
    if (pureName2 === pureName1) {
      index2 = Number(r2?.[2] || 0) + 1;
    }
    if (index2 > maxIndex) {
      maxIndex = index2;
    }
  }
  const index1 = maxIndex + 1;
  return index1 > 1 ? `${pureName1}(${index1 - 1})` : pureName1;
}

export function checkIsImageUrl(url: string) {
  const checkList = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
    ".ico",
    ".tiff",
    ".tif",
  ];
  return checkList.some((t) => url.endsWith(t));
}
