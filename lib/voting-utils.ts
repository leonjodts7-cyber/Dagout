import type { VoteSession } from "@/lib/voting";

export type VoteSessionStatus = "actief" | "verlopen" | "gesloten";

export function isDeadlinePassed(deadline: string | null): boolean {
  if (!deadline) return false;
  const end = new Date(`${deadline}T23:59:59`).getTime();
  return end < Date.now();
}

export function getVoteSessionStatus(session: VoteSession): VoteSessionStatus {
  if (session.closed) return "gesloten";
  if (isDeadlinePassed(session.deadline)) return "verlopen";
  return "actief";
}

export function formatDeadlineNl(deadline: string): string {
  return new Date(`${deadline}T12:00:00`).toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatCountdown(deadline: string): string {
  const end = new Date(`${deadline}T23:59:59`).getTime();
  const diff = end - Date.now();
  if (diff <= 0) return "";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `Nog ${days} ${days === 1 ? "dag" : "dagen"} en ${hours} ${hours === 1 ? "uur" : "uur"} om te stemmen`;
  }
  if (hours > 0) {
    return `Nog ${hours} ${hours === 1 ? "uur" : "uur"} en ${minutes} minuten om te stemmen`;
  }
  return `Nog ${minutes} minuten om te stemmen`;
}

export function formatDurationBadge(minutes: number): string {
  const hours = Math.round(minutes / 60);
  return `${Math.max(1, hours)}u`;
}
