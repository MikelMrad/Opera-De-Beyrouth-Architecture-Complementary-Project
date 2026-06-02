import { generatedSeatViews } from './seatViews.generated';

/**
 * Seat → 360° panorama lookup.
 *
 * Real renders are picked up automatically by filename: drop a JPG named after
 * its seat into public/renders/<auditorium>/ (e.g. main/A22.jpg, chamber/G12.png)
 * and it maps to that seat on the next dev/build — see scripts/generate-seat-views.mjs.
 *
 * The `manualSeatViews` below are hand-kept fallbacks (shared placeholders for
 * auditoria that don't have real renders yet). Auto-generated entries win on
 * any key conflict, so a real file always overrides a placeholder.
 */
const manualSeatViews: Record<string, Record<string, string>> = {
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

function mergeViews(
  base: Record<string, Record<string, string>>,
  override: Record<string, Record<string, string>>,
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const key of new Set([...Object.keys(base), ...Object.keys(override)])) {
    out[key] = { ...base[key], ...override[key] };
  }
  return out;
}

export const seatViews: Record<string, Record<string, string>> = mergeViews(
  manualSeatViews,
  generatedSeatViews,
);

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
