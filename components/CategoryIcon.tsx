interface CategoryIconProps {
  slug: string;
  className?: string;
}

export default function CategoryIcon({
  slug,
  className = "h-10 w-10 text-[#1D9E75] group-hover:text-white",
}: CategoryIconProps) {
  const props = {
    className,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    viewBox: "0 0 24 24",
    "aria-hidden": true as const,
  };

  switch (slug) {
    case "kajakken":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 19c2-2 4-2 6 0s4 2 6 0 4-2 6 0"
          />
          <path strokeLinecap="round" d="M8 12l4-6 4 6" />
        </svg>
      );
    case "escape-room":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path strokeLinecap="round" d="M9 9h.01M15 9h.01M9 15h6" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6" />
        </svg>
      );
    case "kookworkshop":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 10V8a2 2 0 012-2h8a2 2 0 012 2v2M6 10h12v8a2 2 0 01-2 2H8a2 2 0 01-2-2v-8z"
          />
          <path strokeLinecap="round" d="M9 6V4M12 6V3M15 6V4" />
        </svg>
      );
    case "lasergame":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 12h4l2-6 4 12 2-6h4"
          />
        </svg>
      );
    case "outdoor":
      return (
        <svg {...props}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3L4 19h16L12 3z"
          />
          <path strokeLinecap="round" d="M8.5 15h7" />
        </svg>
      );
    case "wellness":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path
            strokeLinecap="round"
            d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"
          />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
