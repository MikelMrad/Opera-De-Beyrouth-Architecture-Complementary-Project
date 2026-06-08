import type { Metadata } from 'next';
import { MonteCarlo, Cormorant_Garamond, Inter } from 'next/font/google';
import AnimationsInit from '@/components/AnimationsInit/AnimationsInit';
import SmoothScroll from '@/components/SmoothScroll/SmoothScroll';
import './globals.css';

const monteCarlo = MonteCarlo({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Opéra de Beyrouth',
  description: "Beirut's First World-Class Opera House — Book your seats",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${monteCarlo.variable} ${cormorant.variable} ${inter.variable}`}
    >
      <body>
        <SmoothScroll />
        <AnimationsInit />
        {children}
      </body>
    </html>
  );
}
