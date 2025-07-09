import { uploadFile } from "@/lib/file.client";
import type { Uploader } from "@milkdown/kit/plugin/upload";
import type { Node } from "@milkdown/kit/prose/model";

export const filesUploader: Uploader = async (files, schema) => {
  const nodes: Node[] = await Promise.all(
    Array.from(files)
      .filter(Boolean)
      .map(async (file) => {
        const src = (await uploadFile(file)).url;
        const alt = file.name;
        const isImage = file.type.includes("image");
        if (isImage) {
          return schema.nodes.image.createAndFill({
            src,
            alt,
          }) as Node;
        }
        return schema.text(file.name, [
          schema.marks.link.create({ href: src }),
        ]);
      }),
  );

  return nodes;
};
