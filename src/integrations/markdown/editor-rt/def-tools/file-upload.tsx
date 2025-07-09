import { selectFileFromBrowser } from "@/lib/file.client";
import { Upload } from "lucide-react";
import { type ExposeParam, NormalToolbar } from "md-editor-rt";
import { toast } from "sonner";
import { handleUploadFiles, insertFileLinks } from "../utils";

export function ToolbarFileUpload({
  refEditor,
}: {
  refEditor: { current: ExposeParam | null };
}) {
  return (
    <NormalToolbar
      title="Upload"
      key="upload"
      onClick={async () => {
        toast.promise(
          async () => {
            const files = await selectFileFromBrowser(true);
            const infos = await handleUploadFiles(files);
            insertFileLinks(refEditor, infos);
          },
          {
            loading: "Uploading...",
            success: "Uploaded",
            error: "Upload cancelled or failed",
          },
        );
      }}
    >
      <Upload className="md-editor-icon" />
    </NormalToolbar>
  );
}
