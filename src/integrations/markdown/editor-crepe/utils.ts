/**
 * Converts markdown text to compact list format by removing unnecessary blank lines between list items
 * @param markdownText - The input markdown text
 * @returns The compacted markdown text with reduced spacing in lists
 */
export function convertToCompactList(markdownText: string): string {
  const testListItem = (str: string) => /^\s*(?:[*-]|\d+\.)\s/.test(str);
  const testBlankLine = (str: string) => /^\s*$/.test(str);
  const deleteLineIndex: number[] = [];
  const lines = markdownText.split("\n").map((line, i) => {
    return {
      index: i,
      isListItem: testListItem(line),
      content: line.trimEnd(),
    };
  });
  for (let i = 0; i < lines.length; i++) {
    const prev = lines[i - 1];
    const current = lines[i];
    const next = lines[i + 1];

    if (
      testBlankLine(current.content) &&
      prev?.isListItem &&
      next?.isListItem
    ) {
      deleteLineIndex.push(current.index);
    }
  }

  return lines
    .filter((line) => !deleteLineIndex.includes(line.index))
    .map((line) => line.content)
    .join("\n");
}
