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
      className="group block overflow-hidden rounded-xl bg-white transition-shadow hover:shadow-lg"
    >
      <div className="relative h-[220px] w-full overflow-hidden rounded-t-xl">
        <Image
          src={imageUrl}
          alt={provider.name}
          fill
          loading="lazy"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 group-hover:text-[#1D9E75]">
          {provider.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {provider.city} · {provider.category}
        </p>
        <p className="mt-2 text-sm font-semibold text-[#1D9E75]">
          Vanaf &euro;{provider.price_from}/pers
        </p>
      </div>
    </Link>
  );
}
