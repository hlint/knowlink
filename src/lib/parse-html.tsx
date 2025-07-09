import * as cheerio from "cheerio";
import * as turndownPluginGfm from "joplin-turndown-plugin-gfm";
import TurndownService from "turndown";

export async function parseBasics(html: string) {
  const dom = cheerio.load(html);
  const title = dom("title").text();
  const description = dom('meta[name="description"]').attr("content") ?? "";
  const bodyHtml = dom("body").html() ?? "";
  const bodyText = (dom("body").text() ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
  return { title, description, bodyHtml, bodyText };
}

export function parseMarkdown(html: string) {
  const turndownService = new TurndownService({
    codeBlockStyle: "fenced",
    headingStyle: "atx",
    bulletListMarker: "*",
  });

  turndownService.use(turndownPluginGfm.gfm);

  turndownService.addRule("ignoreScriptsAndStyles", {
    filter: ["script", "style", "noscript"],
    replacement: () => "",
  });

  turndownService.keep([
    "h1",
    "h2",
    "h3",
    "p",
    "ul",
    "ol",
    "li",
    "a",
    "img",
    "blockquote",
    "pre",
    "code",
  ]);

  let markdown = turndownService.turndown(html);
  markdown = markdown.replace(/\[Skip to Content\]\(#[^\)]*\)/gi, "");

  return markdown;
}
