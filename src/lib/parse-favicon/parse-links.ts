import type { CheerioAPI } from "cheerio";

export function parseLinks(dom: CheerioAPI) {
  const list = linkList
    .map(({ query, reference }) => {
      const link = dom(query);
      return {
        reference,
        src: link.attr("href") ?? "",
        sizes: "unknown",
      };
    })
    .filter(({ src }) => src);
  return list;
}

const linkList = [
  {
    query: "link[rel~='icon']",
    reference: "icon",
  },
  {
    query: 'link[rel="fluid-icon"]',
    reference: "fluid-icon",
  },
  {
    query: 'link[rel="mask-icon"]',
    reference: "mask-icon",
  },
  {
    query: 'link[rel="apple-touch-icon"]',
    reference: "apple-touch-icon",
  },
  {
    query: 'link[rel="apple-touch-icon-precomposed"]',
    reference: "apple-touch-icon-precomposed",
  },
];
