"use server";

import { checkUserAdmin } from "@/dal-server-action";
import { saveFile } from "@/integrations/file-storage";
import { callLlm } from "@/lib/llm/llm";
import { updateSession } from "@/lib/session.server";
import { shortId } from "@/lib/string";
import { revalidatePath } from "next/cache";

export default async function revalidatePathClient(path = "/") {
  revalidatePath(path);
}

export async function updateSessionClient() {
  await updateSession();
  return {
    success: true,
  };
}

export async function callLlmClient(prompt: string) {
  await checkUserAdmin();
  const result = await callLlm({
    dialog: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });
  return {
    result,
  };
}

export async function uploadFileByUrl(url: string) {
  await checkUserAdmin();
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
