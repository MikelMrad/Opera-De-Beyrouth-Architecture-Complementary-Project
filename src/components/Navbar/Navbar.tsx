'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <nav className={`navbar${scrolled || menuOpen ? ' navbar--scrolled' : ''}`}>
        <Link href="/" className="navbar__logo" onClick={closeMenu}>
          Opéra de Beyrouth
        </Link>

        {/* Desktop links */}
        <ul className="navbar__links">
          <li><Link href="/" className="navbar__link">Accueil</Link></li>
          <li>
            <Link href="/reserve?auditorium=main" className="navbar__link">
              Grand Auditorium
            </Link>
          </li>
          <li>
            <Link href="/reserve?auditorium=chamber" className="navbar__link">
              Petit Auditorium
            </Link>
          </li>
        </ul>

        {/* Hamburger — mobile only */}
        <button
          className={`navbar__hamburger${menuOpen ? ' navbar__hamburger--open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
        >
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
          <span className="navbar__hamburger-line" />
        </button>
      </nav>

      {/* Full-screen mobile overlay */}
      <div
        className={`navbar__mobile-overlay${menuOpen ? ' navbar__mobile-overlay--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className="navbar__mobile-links">
          <li>
            <Link href="/" className="navbar__mobile-link" onClick={closeMenu}>
              Accueil
            </Link>
          </li>
          <li>
            <Link
              href="/reserve?auditorium=main"
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              Grand Auditorium
            </Link>
          </li>
          <li>
            <Link
              href="/reserve?auditorium=chamber"
              className="navbar__mobile-link"
              onClick={closeMenu}
            >
              Petit Auditorium
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}
