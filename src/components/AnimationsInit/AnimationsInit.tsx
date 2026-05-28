'use client';

// Thin client wrapper so layout.tsx (a server component) can call
// useScrollAnimations. Re-initializes on every route change.

import { usePathname } from 'next/navigation';
import { useScrollAnimations } from '@/hooks/useScrollAnimations';

export default function AnimationsInit() {
  const pathname = usePathname();
  useScrollAnimations(pathname);
  return null;
}
