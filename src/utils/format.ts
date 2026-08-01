export function roundTo2(value: number): number {
  if (isNaN(value) || value === null || value === undefined) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatNumber(value: number, maxDecimals: number = 2): string {
  if (isNaN(value) || value === null || value === undefined) return "0";
  const rounded = roundTo2(value);
  return rounded.toString();
}

export function formatMoney(value: number): string {
  if (isNaN(value) || value === null || value === undefined) return "0.00";
  return roundTo2(value).toFixed(2);
}

