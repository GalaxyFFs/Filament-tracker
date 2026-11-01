export function roundTo2(value: number): number {
  if (typeof value !== "number" || isNaN(value) || !isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatNumber(value: number, maxDecimals: number = 2): string {
  if (typeof value !== "number" || isNaN(value) || !isFinite(value)) return "0";
  const rounded = roundTo2(value);
  const decimals = Math.min(maxDecimals, 2);
  return rounded.toFixed(decimals).replace(/\.?0+$/, "");
}

export function formatMoney(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return "0.00";
  return roundTo2(value).toFixed(2);
}

