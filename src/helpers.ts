export function gridSnap (value: number): number {
  return Math.round(value / 10) * 10
}
