import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Knowlink",
    short_name: "Knowlink",
    description:
      "Knowlink is an AI-powered web app for organizing your notes and bookmarks.",
    start_url: "/",
    display: "standalone",
    orientation: "any",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/logo.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  };
}
