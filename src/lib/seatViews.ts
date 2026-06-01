export const seatViews: Record<string, Record<string, string>> = {
  main: {
    'A1':  '/renders/main/placeholder.jpg',
    'A5':  '/renders/main/placeholder.jpg',
    'A10': '/renders/main/placeholder.jpg',
    'B1':  '/renders/main/placeholder.jpg',
    'B5':  '/renders/main/placeholder.jpg',
    'B10': '/renders/main/placeholder.jpg',
    'C1':  '/renders/main/placeholder.jpg',
    'C5':  '/renders/main/placeholder.jpg',
    'C10': '/renders/main/placeholder.jpg',
  },
  chamber: {
    'A1':  '/renders/chamber/placeholder.jpg',
    'A5':  '/renders/chamber/placeholder.jpg',
    'A10': '/renders/chamber/placeholder.jpg',
    'B1':  '/renders/chamber/placeholder.jpg',
    'B5':  '/renders/chamber/placeholder.jpg',
    'B10': '/renders/chamber/placeholder.jpg',
    'C1':  '/renders/chamber/placeholder.jpg',
    'C5':  '/renders/chamber/placeholder.jpg',
    'C10': '/renders/chamber/placeholder.jpg',
  },
};

export function getClosestView(
  auditorium: string,
  seatId: string,
  allViews: Record<string, Record<string, string>>,
): string | null {
  const views = allViews[auditorium] ?? {};

  if (views[seatId]) return views[seatId];

  const keys = Object.keys(views);
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
      best = views[key];
    }
  }

  return best;
}
