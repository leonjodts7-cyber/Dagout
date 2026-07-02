import ListingCard from "@/components/ListingCard";
import type { Provider } from "@/lib/types";

interface PopularActivityCardProps {
  provider: Provider;
}

export default function PopularActivityCard({ provider }: PopularActivityCardProps) {
  return <ListingCard provider={provider} />;
}
