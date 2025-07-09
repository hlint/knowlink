import type { SavedFileInfo } from "@/integrations/file-storage";
import { saveAs } from "file-saver";
export type { SavedFileInfo };

export async function uploadFile(file: File, path = "/api/upload") {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(path, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      (data as { error: string }).error || "Failed to upload file",
    );
  }
  return data as SavedFileInfo;
}

export function exportFile(dataStr: string, name = "data.txt") {
  const file = new File([dataStr], name, {
    type: "text/plain;charset=utf-8",
  });
  saveAs(file);
}

export function exportJsonFile(data: unknown, name = "data.json") {
  exportFile(JSON.stringify(data, null, 2), name);
}

export async function importJsonFile(): Promise<unknown> {
  const file = await selectFileFromBrowser();
  const data = await importFile(file);
  return JSON.parse(data);
}

export function importFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result || "";
      resolve(content as string);
    };
    reader.onerror = (e) => {
      reject(e);
    };
    reader.readAsText(file, "utf8");
  });
}

export function selectFileFromBrowser(
  multiple?: false,
  accept?: string,
): Promise<File>;
export function selectFileFromBrowser(
  multiple?: true,
  accept?: string,
): Promise<File[]>;
export function selectFileFromBrowser(
  multiple = false,
  accept = "*",
): Promise<File | File[]> {
  return new Promise((resolve, reject) => {
    let fileCancle = true;
    // Create a hidden input element and open the file picker dialog
    const elInput = document.createElement("input");
    elInput.type = "file";
    elInput.accept = accept;
    elInput.multiple = multiple;
    elInput.style.display = "none";
    document.body.append(elInput); // For iOS compatibility, must be mounted to body
    // Listen for cancel actions
    window.addEventListener(
      "focus",
      () => {
        setTimeout(() => {
          if (fileCancle) {
            // Cancel handing logic
            reject("cancelled upload");
          }
        }, 1000);
      },
      { once: true },
    );
    elInput.onchange = () => {
      fileCancle = false;
      const file = elInput?.files?.[0];
      if (file) {
        if (multiple) {
          resolve(Array.from(elInput.files!));
        } else {
          resolve(file);
        }
      } else {
        reject("cancelled upload");
      }
      setTimeout(() => {
        document.body.removeChild(elInput);
      }, 0);
    };
    elInput.click();
  });
}
