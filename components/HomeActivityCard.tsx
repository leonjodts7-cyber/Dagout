import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getCategoryStyle } from "@/lib/constants";

interface HomeActivityCardProps {
  provider: Provider;
}

export default function HomeActivityCard({ provider }: HomeActivityCardProps) {
  const style = getCategoryStyle(provider.category);

  return (
    <Link
      href={`/activiteit/${provider.slug}`}
      className="group block cursor-pointer overflow-hidden rounded-2xl bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.12)]"
    >
      <div
        className="flex h-[200px] items-end justify-start p-6"
        style={{ background: style.gradientLight }}
      >
        <span className="text-5xl opacity-40" aria-hidden>
          {style.emoji}
        </span>
      </div>
      <div className="bg-white p-4">
        <h3 className="text-base font-semibold text-[#111827]">
          {provider.name}
        </h3>
        <p className="mt-1 text-sm text-[#9ca3af]">{provider.city}</p>
        <p className="mt-2 text-[15px] font-semibold text-[#1D9E75]">
          Vanaf &euro;{provider.price_from}/pers
        </p>
      </div>
    </Link>
  );
}
