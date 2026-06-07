"use client";

import { usePathname } from "next/navigation";
import BackButton from "@/components/BackButton";

export default function GlobalBackButton() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return <BackButton />;
}
