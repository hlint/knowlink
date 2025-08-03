import { generateImage } from "@/lib/ai-image-generation";
import { callLlm } from "@/lib/llm/llm";

export async function generateIllustration(categoryInfo: string, details = "") {
  const description = await callLlm({
    dialog: [
      { role: "system", content: prompt },
      {
        role: "user",
        content: `<INFORMATION>${categoryInfo}</INFORMATION><DETAILS>${details}</DETAILS>`,
      },
    ],
  });
  const { url } = await generateImage({
    description,
    model: "flux",
    size: { width: 1600, height: 400 },
  });
  return url;
}

const prompt = `You are a professional illustrator. Create a specific scene description for a landscape header image based on the given INFORMATION and DETAILS.

Requirements:
- Create a single, specific scene that related to the INFORMATION and DETAILS
- Use flat design style with simple geometric shapes
- Make the main subject take up 60% of the composition
- Use cool colors with minimal shadows
- Keep the background subtle but not white

Output only the scene description, no explanations.`;
