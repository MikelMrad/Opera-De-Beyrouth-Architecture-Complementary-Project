'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // set correct state on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <Link href="/" className="navbar__logo">
        Opéra de Beyrouth
      </Link>
      <ul className="navbar__links">
        <li>
          <Link href="/" className="navbar__link">
            Accueil
          </Link>
        </li>
        <li>
          <Link href="/reserve?auditorium=main" className="navbar__link">
            Le Phénix
          </Link>
        </li>
        <li>
          <Link href="/reserve?auditorium=chamber" className="navbar__link">
            Salle de l&apos;Âme
          </Link>
        </li>
      </ul>
    </nav>
  );
}
