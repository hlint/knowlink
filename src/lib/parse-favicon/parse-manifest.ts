import { z } from "zod";

export async function parseManifest(manifestUrl: string) {
  const manifest = await fetch(manifestUrl).then((res) => res.text());
  const icons = tryGetManifestJson(manifest);
  return icons;
}

function tryGetManifestJson(manifest: string) {
  try {
    return z
      .array(
        z.object({
          reference: z.string().default("manifest"),
          src: z.string(),
          sizes: z.string().default("unknown"),
        }),
      )
      .parse((JSON.parse(manifest) as { icons: unknown[] }).icons);
  } catch (_error) {
    return [];
  }
}
