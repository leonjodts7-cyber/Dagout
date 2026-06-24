import Image from "next/image";
import Link from "next/link";
import type { Provider } from "@/lib/types";
import { getProviderImageUrl } from "@/lib/constants";

interface SearchResultCardProps {
  provider: Provider;
}

export default function SearchResultCard({ provider }: SearchResultCardProps) {
  const imageUrl =
    provider.image_url ?? getProviderImageUrl(provider.category, provider.slug);

  return (
    <article className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm">
      <Link
        href={`/activiteit/${provider.slug}`}
        className="relative h-[150px] w-[150px] shrink-0 overflow-hidden rounded-lg"
      >
        <Image
          src={imageUrl}
          alt={provider.name}
          fill
          loading="lazy"
          className="object-cover"
          sizes="150px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
            {provider.category}
          </span>
          <Link href={`/activiteit/${provider.slug}`}>
            <h2 className="mt-2 text-lg font-bold text-gray-900 hover:text-[#1D9E75]">
              {provider.name}
            </h2>
          </Link>
          <p className="mt-0.5 text-sm text-gray-500">{provider.city}</p>
          <p className="mt-2 text-base font-semibold text-[#1D9E75]">
            &euro;{provider.price_from}/pers
          </p>
        </div>
        <Link
          href={`/activiteit/${provider.slug}`}
          className="mt-3 inline-flex w-fit rounded-lg bg-[#1D9E75] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#178a66]"
        >
          Bekijk
        </Link>
      </div>
    </article>
  );
}
