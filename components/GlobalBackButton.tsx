"use client";

import { usePathname } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function GlobalBackButton() {
  const pathname = usePathname();

  if (pathname === "/" || pathname.startsWith("/dashboard")) return null;

  return <BackButton />;
}
