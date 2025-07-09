import { Decoration } from "prosemirror-view";

type UploadWidgetFactory = (
  pos: number,
  spec: Parameters<typeof Decoration.widget>[2],
) => Decoration;

export const uploadWidgetFactory: UploadWidgetFactory = (pos, spec) => {
  const widgetDOM = document.createElement("span");
  widgetDOM.className = "upload-widget";
  widgetDOM.textContent = "Upload in progress...";
  return Decoration.widget(pos, widgetDOM, spec);
};
