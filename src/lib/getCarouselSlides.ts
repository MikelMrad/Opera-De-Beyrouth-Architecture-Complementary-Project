import fs from 'fs';
import path from 'path';

export interface CarouselSlide {
  src: string;
  caption?: string;
}

export function getCarouselSlides(folderName: string): CarouselSlide[] {
  const dir = path.join(process.cwd(), 'public', 'images', folderName);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter(f => /\.(webp|jpe?g|png)$/i.test(f))
    .sort()
    .map(f => ({ src: `/images/${folderName}/${f}` }));
}
