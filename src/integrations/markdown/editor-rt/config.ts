import "md-editor-rt/lib/style.css";
import "@yuri2/codemirror-ai-enhancer/styles.css";
import "@vavt/rt-extension/lib/asset/style.css";
import { aiEnhancer } from "@yuri2/codemirror-ai-enhancer";
import Anchor from "markdown-it-anchor";
import LinkAttr from "markdown-it-link-attributes";
import { config } from "md-editor-rt";
import { aiEnhancerConfig } from "../editor-codemirror/features/ai-enhancer-config";

config({
  markdownItPlugins(plugins) {
    return [
      ...plugins.map((item) => {
        if (item.type === "taskList") {
          return {
            ...item,
            options: {
              ...item.options,
              enabled: true,
            },
          };
        }

        return item;
      }),
      // {
      //   type: "mark",
      //   plugin: MarkExtension,
      //   options: {},
      // },
      {
        type: "linkAttr",
        plugin: LinkAttr,
        options: {
          matcher(href: string) {
            return !href.startsWith("#");
          },
          attrs: {
            target: "_blank",
          },
        },
      },
      {
        type: "anchor",
        plugin: Anchor,
        options: {
          // permalink: true,
          permalink: Anchor.permalink.headerLink(),
          // permalinkSymbol: '#',
          // permalinkBefore: false,
          // permalinkSpace: false,
          slugify(s: string) {
            return s;
          },
        },
      },
    ];
  },
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, aiEnhancer(aiEnhancerConfig)];
  },
});
