import { uploadFileByUrl } from "@/app/actions";
import * as cheerio from "cheerio";
import { Queue } from "./queue";
import { fixRelativeLinks } from "./string";

export function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorResponse(error: unknown, status = 500) {
  let message = String(error);
  if (error instanceof Error) {
    message = error.message;
  }
  return jsonResponse({ error: message }, status);
}

// SSE response, used for streaming text
// For the client, use "@/lib/fetch-event-source" to receive the stream
export function generateSseResponse(
  task: (textWriter: (text: string) => void) => Promise<void>,
) {
  const outputStream = new TransformStream();
  const writer = outputStream.writable.getWriter();
  const writeQueue = new Queue();
  const writeTextPlain = async (text: string) => {
    try {
      await writer.ready;
      const encoder = new TextEncoder();
      const data = `data: ${text}\n\n`;
      await writer.write(encoder.encode(data));
    } catch (error) {
      console.error("Error writing text:", error);
    }
  };
  const writeText = (text: string) => {
    writeQueue.add(writeTextPlain(text));
  };
  // Create a response immediately with the readable stream
  const response = new Response(outputStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });

  // Handle the task and writer closure in the background
  (async () => {
    try {
      await task(writeText);
    } catch (error) {
      console.error("Stream task error:", error);
    }
    await writeQueue.allCleared();
    writer.close();
  })();

  return response;
}

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

/**
 * Scrapes HTML content from a given URL or uses provided HTML.
 *
 * @param {string} url - The URL to scrape HTML from.
 * @param {Object} options - Optional parameters for scraping.
 * @param {string} [options.providedHtml] - HTML content to use instead of fetching from the URL.
 * @param {string} [options.userAgent=DEFAULT_USER_AGENT] - User-Agent string to use for the request.
 * @param {boolean} [options.transRelativeLinks=true] - Whether to transform relative links to absolute.
 * @param {boolean} [options.removeScriptsAndStyles=true] - Whether to remove <script> and <style> tags.
 * @param {boolean} [options.removeUnusedAttributes=true] - Whether to remove unused attributes from HTML elements.
 * @param {boolean} [options.saveImagesToLocal=false] - Whether to save images to local storage.
 *
 * @returns {Promise<string>} - The scraped HTML content.
 */

export async function scrapeHtml(
  url: string,
  {
    providedHtml,
    userAgent = DEFAULT_USER_AGENT,
    transRelativeLinks = true,
    removeScriptsAndStyles = true,
    removeUnusedAttributes = true,
    saveImagesToLocal = false,
  }: {
    providedHtml?: string;
    userAgent?: string;
    transRelativeLinks?: boolean;
    removeScriptsAndStyles?: boolean;
    removeUnusedAttributes?: boolean;
    saveImagesToLocal?: boolean;
  } = {},
): Promise<string> {
  let html = `<html><head><title>Error</title></head><body><p>${url} is not available.</p></body></html>`;
  if (providedHtml) {
    html = providedHtml;
  } else {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
        },
      });
      html = await res.text();
    } catch (_error) {}
  }
  const dom = cheerio.load(html);
  const baseUrl = (() => {
    const baseUrl = dom("base").attr("href");
    if (baseUrl) {
      return new URL(baseUrl, url).href;
    }
    return url;
  })();
  if (removeScriptsAndStyles) {
    dom("script, style, noscript, svg, iframe").remove();
  }
  if (removeUnusedAttributes) {
    dom("*").each((_index, item) => {
      const attrs = dom(item).attr();
      if (attrs) {
        for (const attr of Object.keys(attrs)) {
          if (
            ![
              "id",
              "src",
              "href",
              "title",
              "alt",
              "name",
              "content",
              "rel",
            ].includes(attr)
          ) {
            dom(item).removeAttr(attr);
          }
        }
      }
    });
  }
  if (transRelativeLinks) {
    dom("meta, a, link").each((_index, item) => {
      const href = dom(item).attr("href");
      if (href) {
        dom(item).attr("href", fixRelativeLinks(href, baseUrl));
      }
    });
    dom("img").each((_index, item) => {
      const src = dom(item).attr("src");
      if (src) {
        dom(item).attr("src", fixRelativeLinks(src, baseUrl));
      }
    });
    if (saveImagesToLocal) {
      const imgElements = dom("img").toArray();
      const uploadPromises = imgElements.map(async (item) => {
        const src = dom(item).attr("src");
        if (src) {
          try {
            const result = await uploadFileByUrl(src);
            if (result?.url) {
              dom(item).attr("src", result.url);
            }
          } catch (_err) {
            // console.warn("uploadFileByUrl error for src:", src, _err);
          }
        }
      });
      await Promise.all(uploadPromises);
    }
  }
  html = dom.html();
  return html;
}
