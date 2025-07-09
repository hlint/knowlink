import path from "node:path";
import fs from "fs-extra";

// Traverse directory
export async function deepDirScan(
  dir: string,
  _results: {
    absolutePath: string;
    relativePath: string;
    fileName: string;
    size: number;
  }[] = [],
  _relativePath = "",
) {
  const files = await fs.readdir(path.join(dir, _relativePath));
  for (const file of files) {
    const stats = await fs.stat(path.join(dir, _relativePath, file));
    const isDir = stats.isDirectory();
    if (isDir) {
      // Recursive call
      await deepDirScan(dir, _results, path.join(_relativePath, file));
    } else {
      // Record file
      _results.push({
        absolutePath: path.join(dir, _relativePath, file),
        relativePath: path.join(_relativePath, file),
        fileName: file,
        size: stats.size,
      });
    }
  }
  return _results;
}
