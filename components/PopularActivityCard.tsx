import ActivityCard from "@/components/ActivityCard";
import type { Provider } from "@/lib/types";

interface PopularActivityCardProps {
  provider: Provider;
}

export default function PopularActivityCard({ provider }: PopularActivityCardProps) {
  return <ActivityCard provider={provider} showFavorite />;
}
