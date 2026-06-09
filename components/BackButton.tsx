"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Terug"
      className="group fixed top-20 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-gray-200/80 bg-white shadow-lg transition-all duration-200 hover:scale-105 hover:border-[#1D9E75] hover:bg-[#1D9E75] hover:shadow-xl"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="text-[#1D9E75] transition-colors duration-200 group-hover:text-white"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
