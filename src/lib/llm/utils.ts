import { countTokens } from "gpt-tokenizer";

export function truncateTextByTokens(text: string, maxTokens: number) {
  const length = text.length;
  const tokens = countTokens(text);
  if (tokens > maxTokens) {
    const ratio = maxTokens / tokens;
    const newLength = Math.floor(length * ratio);
    return text.slice(0, newLength);
  }
  return text;
}
