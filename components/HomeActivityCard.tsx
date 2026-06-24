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
    <article className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/activiteit/${provider.slug}`} className="relative block h-[200px] w-full">
        <Image
          src={imageUrl}
          alt={provider.name}
          fill
          loading="lazy"
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/activiteit/${provider.slug}`}>
          <h3 className="font-bold text-gray-900 hover:text-[#1D9E75]">
            {provider.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-gray-500">{provider.city}</p>
        <p className="mt-2 text-base font-semibold text-[#1D9E75]">
          &euro;{provider.price_from}/pers
        </p>
        <Link
          href={`/activiteit/${provider.slug}`}
          className="mt-4 block w-full rounded-lg bg-[#1D9E75] py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
        >
          Bekijk
        </Link>
      </div>
    </article>
  );
}
