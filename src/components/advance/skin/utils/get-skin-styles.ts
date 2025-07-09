import { skins } from "../skins";

export function getSkinStyles(name: string) {
  const skin = skins.find((item) => item.name === name);
  if (!skin) {
    return "";
  }
  const { cssVars } = skin;
  return `
:root {
${Object.entries(cssVars.theme)
  .map(([key, value]) => `--${key}: ${value};`)
  .join("\n")}

${Object.entries(cssVars.light)
  .map(([key, value]) => `--${key}: ${value};`)
  .join("\n")}
}

.dark {
${Object.entries(cssVars.dark)
  .map(([key, value]) => `--${key}: ${value};`)
  .join("\n")}
}
  `;
}
