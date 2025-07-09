// https://image.pollinations.ai/models
// Model gptimage needs token. Use 'gptimage' for precise rendering of text or charts.
import { saveFile } from "@/integrations/file-storage";
import { shortId } from "@/lib/string";
import { createImageService } from "pollinationsai";
import { random } from "radashi";

export async function generateImage({
  description,
  model,
  size,
}: {
  description: string;
  model: "flux" | "turbo" | "gptimage";
  size: {
    width: number;
    height: number;
  };
}) {
  const imageService = createImageService();
  // Generate image from prompt
  const imageBuffer = await imageService.generate(description, {
    model,
    // 16:9
    width: size.width,
    height: size.height,
    private: true,
    safe: false,
    nologo: true,
    enhance: true,
    seed: random(0, 1000000),
  });
  const filename = `${shortId()}.jpg`;
  const file = new File([imageBuffer], filename, {
    type: "image/jpeg",
  });
  const fileSaved = await saveFile(file);
  return fileSaved;
}
