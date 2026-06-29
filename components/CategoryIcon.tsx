type CategoryIconProps = {
  slug: string;
  className?: string;
};

export default function CategoryIcon({
  slug,
  className = "h-8 w-8",
}: CategoryIconProps) {
  const props = {
    className,
    fill: "none" as const,
    stroke: "white",
    strokeWidth: 1.5,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "kajakken":
      return (
        <svg {...props}>
          <path d="M3 12c0 0 2-4 9-4s9 4 9 4" />
          <path d="M7 12c0 0 1 4 5 4s5-4 5-4" />
          <path d="M2 8l4 4-4 4" />
          <path d="M22 8l-4 4 4 4" />
        </svg>
      );
    case "escape-room":
      return (
        <svg {...props}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          <circle cx="12" cy="16" r="1" fill="white" />
        </svg>
      );
    case "kookworkshop":
      return (
        <svg {...props}>
          <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
          <line x1="6" y1="17" x2="18" y2="17" />
        </svg>
      );
    case "lasergame":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
          <line x1="22" y1="12" x2="18" y2="12" />
          <line x1="6" y1="12" x2="2" y2="12" />
          <line x1="12" y1="6" x2="12" y2="2" />
          <line x1="12" y1="22" x2="12" y2="18" />
        </svg>
      );
    case "wellness":
      return (
        <svg {...props}>
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <path d="M3 17l4-8 4 5 3-3 7 6" />
          <path d="M20 21H4" />
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
