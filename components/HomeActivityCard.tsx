import Image from "next/image";
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
      className="card-lift block overflow-hidden rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
    >
      <div className="relative h-[200px] w-full">
        <Image
          src={imageUrl}
          alt={provider.name}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-[#111827]">
          {provider.name}
        </h3>
        <p className="mt-1 text-sm text-[#6b7280]">{provider.city}</p>
        <p className="mt-2 text-[15px] font-semibold text-[#1D9E75]">
          Vanaf &euro;{provider.price_from}/pers
        </p>
      </div>
    </Link>
  );
}
