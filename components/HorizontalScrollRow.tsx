"use client";

import { useRef, type ReactNode } from "react";

interface HorizontalScrollRowProps {
  children: ReactNode;
  scrollAmount?: number;
}

function ScrollArrow({
  direction,
  onClick,
}: {
  direction: "left" | "right";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "left" ? "Scroll links" : "Scroll rechts"}
      className={`absolute top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-700 shadow-md transition hover:shadow-lg md:flex ${
        direction === "left" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2"
      }`}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden
      >
        {direction === "left" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        )}
      </svg>
    </button>
  );
}

export default function HorizontalScrollRow({
  children,
  scrollAmount = 360,
}: HorizontalScrollRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative px-0 md:px-4">
      <ScrollArrow direction="left" onClick={() => scroll("left")} />
      <div ref={scrollRef} className="horizontal-scroll-row flex gap-5">
        {children}
      </div>
      <ScrollArrow direction="right" onClick={() => scroll("right")} />
    </div>
  );
}
