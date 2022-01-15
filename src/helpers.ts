export function gridSnap (value: number): number {
  return Math.round(value / 10) * 10
}

const graphConfigCell = 20
export const graphConfig = {
  cell: graphConfigCell,
  cellLarge: graphConfigCell * 5,
  size: graphConfigCell * 5 * 100
}
