/** Belgisch datumformaat: "9 juni 2026" */
export function formatBelgianDate(
  date: Date | string | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString("nl-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}
