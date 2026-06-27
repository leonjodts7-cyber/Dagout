import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getProviderImageUrl } from "@/lib/constants";

interface HomeActivityCardProps {
  provider: Provider;
}

export default function HomeActivityCard({ provider }: HomeActivityCardProps) {
  const imageUrl =
    provider.image_url ?? getProviderImageUrl(provider.category, provider.slug);

  return (
    <Link
      href={`/activiteit/${provider.slug}`}
      className="group block cursor-pointer overflow-hidden rounded-2xl border border-[#f3f4f6] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]"
    >
      <img
        src={imageUrl}
        alt={provider.name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <div className="p-4">
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
