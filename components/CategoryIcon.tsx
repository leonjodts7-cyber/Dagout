type CategoryIconProps = {
  slug: string;
  className?: string;
};

export default function CategoryIcon({ slug, className = "h-16 w-16" }: CategoryIconProps) {
  const props = {
    className,
    fill: "none",
    stroke: "white",
    strokeWidth: 1.5,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "kajakken":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10l4-4 4 4M12 6v12" />
        </svg>
      );
    case "escape-room":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 11a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      );
    case "kookworkshop":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12M6 8a2 2 0 01-2-2V5h16v1a2 2 0 01-2 2M6 8v10a2 2 0 002 2h8a2 2 0 002-2V8" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 14h6" />
        </svg>
      );
    case "lasergame":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        </svg>
      );
    case "wellness":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1 3-4 5-4 8a4 4 0 008 0c0-3-3-5-4-8z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 21h8M10 18h4" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 20l9-16 9 16H3z" />
        </svg>
      );
  }
}

export function resolveCategorySlug(categoryOrSlug: string): string {
  const map: Record<string, string> = {
    Kajakken: "kajakken",
    "Escape Room": "escape-room",
    Kookworkshop: "kookworkshop",
    Lasergame: "lasergame",
    Outdoor: "outdoor",
    Wellness: "wellness",
  };
  return (
    map[categoryOrSlug] ?? categoryOrSlug.toLowerCase().replace(/\s+/g, "-")
  );
}
