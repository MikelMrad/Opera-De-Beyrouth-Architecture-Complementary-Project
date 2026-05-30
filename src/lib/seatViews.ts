export const seatViews: Record<string, string> = {
  'A1':  '/renders/placeholder.jpg',
  'A5':  '/renders/placeholder.jpg',
  'A10': '/renders/placeholder.jpg',
  'B1':  '/renders/placeholder.jpg',
  'B5':  '/renders/placeholder.jpg',
  'B10': '/renders/placeholder.jpg',
  'C1':  '/renders/placeholder.jpg',
  'C5':  '/renders/placeholder.jpg',
  'C10': '/renders/placeholder.jpg',
};

export function getClosestView(
  seatId: string,
  allViews: Record<string, string>,
): string | null {
  if (allViews[seatId]) return allViews[seatId];

  const keys = Object.keys(allViews);
  if (keys.length === 0) return null;

  const parse = (id: string) => ({
    row: id.charCodeAt(0) - 65,
    num: parseInt(id.slice(1), 10),
  });

  const { row, num } = parse(seatId);
  let best: string | null = null;
  let minDist = Infinity;

  for (const key of keys) {
    const k = parse(key);
    const dist = Math.hypot(row - k.row, num - k.num);
    if (dist < minDist) {
      minDist = dist;
      best = allViews[key];
    }
  }

  return best;
}
