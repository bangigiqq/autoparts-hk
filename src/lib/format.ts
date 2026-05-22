export function formatPrice(centsOrDollars: number): string {
  return `$${centsOrDollars.toLocaleString("zh-HK")}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function stars(rating: number): string {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
