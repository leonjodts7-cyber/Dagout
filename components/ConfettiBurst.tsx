"use client";

import { useEffect } from "react";

interface ConfettiBurstProps {
  active: boolean;
}

export default function ConfettiBurst({ active }: ConfettiBurstProps) {
  useEffect(() => {
    if (!active) return;

    const colors = ["#1D9E75", "#fbbf24", "#34d399", "#60a5fa", "#f472b6"];
    const container = document.createElement("div");
    container.setAttribute("aria-hidden", "true");
    container.style.cssText =
      "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
    document.body.appendChild(container);

    const pieces: HTMLDivElement[] = [];

    for (let i = 0; i < 90; i++) {
      const piece = document.createElement("div");
      const size = 6 + Math.random() * 8;
      const left = Math.random() * 100;
      const delay = Math.random() * 400;
      const duration = 1800 + Math.random() * 1200;

      piece.style.cssText = `
        position:absolute;
        top:-12px;
        left:${left}%;
        width:${size}px;
        height:${size * 0.6}px;
        background:${colors[i % colors.length]};
        border-radius:2px;
        opacity:0.95;
        transform:rotate(${Math.random() * 360}deg);
        animation:confetti-fall ${duration}ms ease-in ${delay}ms forwards;
      `;
      container.appendChild(piece);
      pieces.push(piece);
    }

    const timeout = window.setTimeout(() => {
      container.remove();
    }, 3500);

    return () => {
      window.clearTimeout(timeout);
      container.remove();
      pieces.length = 0;
    };
  }, [active]);

  return null;
}
