import { selectFileFromBrowser } from "@/lib/file.client";
import type { Node } from "prosemirror-model";
import type { EditorState, Transaction } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";
import { toast } from "sonner";
import { filesUploader } from "./files-uploader";

export const callUploadFiles = async (view: EditorView) => {
  toast.promise(
    async () => {
      const files = await selectFileFromBrowser(true);
      const nodes = await filesUploader(
        files as unknown as FileList,
        view.state.schema,
      );
      const command = clearContentAndAddNode(nodes as Node[]);
      command(view.state, view.dispatch);
    },
    {
      loading: "Uploading...",
      success: "Uploaded",
      error: "Upload cancelled or failed",
    },
  );
};

function clearContentAndAddNode(nodes: Node[]) {
  return (state: EditorState, dispatch: (tr: Transaction) => void) => {
    const tr = addNodes(clearRange(state.tr), nodes);
    if (!tr) return false;

    if (dispatch) dispatch(tr.scrollIntoView());

    return true;
  };
}

function clearRange(tr: Transaction) {
  const { $from, $to } = tr.selection;
  const { pos: from } = $from;
  const { pos: to } = $to;
  return tr.deleteRange(from - $from.node().content.size, to);
}

// function addNode(tr: Transaction, node: Node) {
//   return tr.replaceSelectionWith(node, false);
// }

function addNodes(tr: Transaction, nodes: Node[]) {
  return tr.insert(tr.selection.from, nodes);
}
