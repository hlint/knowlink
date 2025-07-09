import { uploadFile } from "@/lib/file.client";
import type { ExposeParam } from "md-editor-rt";
import { toast } from "sonner";

export async function handleUploadFiles(
  files: File[],
  callback?: (
    infos: {
      url: string;
      alt: string;
      title: string;
    }[],
  ) => void,
) {
  const infos = await Promise.all(
    files.map(async (file) => {
      return uploadFile(file);
    }),
  );
  const res = infos.map((t) => ({
    url: t.url,
    alt: t.name,
    title: t.name,
    type: t.type,
  }));
  callback?.(res);
  return res;
}

export function insertFileLinks(
  refEditor: { current: ExposeParam | null },
  infos: {
    url: string;
    title: string;
  }[],
) {
  refEditor.current!.insert(() => {
    return {
      targetValue: infos
        .map((info) => `[${info.title}](${info.url})`)
        .join(" | "),
      select: true,
    };
  });
}

export async function handleDrop({
  refEditor,
  files,
}: {
  refEditor: { current: ExposeParam | null };
  files: File[];
}) {
  toast.promise(
    async () => {
      const infos = await handleUploadFiles(Array.from(files));
      refEditor.current!.insert(() => {
        return {
          targetValue: infos
            .map(
              (info) =>
                `${info.type.startsWith("image") ? "!" : ""}[${info.title}](${info.url})`,
            )
            .join(" | "),
          select: true,
        };
      });
    },
    {
      loading: "Uploading...",
      success: "Uploaded",
      error: "Upload failed",
    },
  );
}
