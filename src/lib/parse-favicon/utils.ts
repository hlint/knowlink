import type { CheerioAPI } from "cheerio";

export function getBaseUrl(dom: CheerioAPI, url: string) {
  const baseUrl = dom("base").attr("href");
  if (baseUrl) {
    return new URL(baseUrl, url).href;
  }
  return url;
}

export function getManifestUrl(dom: CheerioAPI) {
  const manifest = dom("link[rel='manifest']").attr("href");
  return manifest;
}
