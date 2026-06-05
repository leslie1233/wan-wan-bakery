export function formatPrice(priceCents: number): string {
  return `$${(priceCents / 100).toFixed(priceCents % 100 === 0 ? 0 : 2)}`;
}

export function formatFromPrice(priceCents: number): string {
  return `From ${formatPrice(priceCents)}`;
}
