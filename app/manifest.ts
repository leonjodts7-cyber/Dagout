import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dagout.be — Teambuilding platform",
    short_name: "Dagout",
    description:
      "Vind en plan de perfecte teambuilding activiteit voor je team in België.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a2a1f",
    theme_color: "#1D9E75",
    lang: "nl",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
