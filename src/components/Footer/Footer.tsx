import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__grid">
          {/* Each column has anim-fade-up so ScrollTrigger.batch stagger-animates them.
              Previously the parent had it, meaning the whole grid was opacity:0 forever. */}

          {/* Brand */}
          <div className="anim-fade-up">
            <p className="footer__brand-name">Opéra de Beyrouth</p>
            <p className="footer__brand-tagline">
              La Première Maison d&apos;Opéra de Renommée Mondiale à Beyrouth.<br />
              Là où la culture, l&apos;histoire et l&apos;art convergent.
            </p>
          </div>

          {/* Address */}
          <div className="anim-fade-up">
            <p className="footer__col-title">Nous Rendre Visite</p>
            <address className="footer__address">
              Centre Culturel — Opéra de Beyrouth<br />
              Place des Martyrs, Centre-Ville<br />
              Beyrouth, Liban
            </address>
          </div>

          {/* Contact & nav */}
          <div className="anim-fade-up">
            <p className="footer__col-title">Contact</p>
            <address className="footer__contact">
              <a href="tel:+9611234567" className="footer__link">+961 1 234 567</a>
              <a href="mailto:info@operadebeyrouth.lb" className="footer__link">
                info@operadebeyrouth.lb
              </a>
            </address>
            <div>
              <Link href="/" className="footer__link">Accueil</Link>
              <Link href="/reserve?auditorium=main" className="footer__link">
                Le Phénix
              </Link>
              <Link href="/reserve?auditorium=chamber" className="footer__link">
                Salle de l&apos;Âme
              </Link>
            </div>
          </div>
        </div>

        <div className="footer__divider" />

        <div className="footer__bottom anim-fade-up">
          <p className="footer__copyright">
            © {new Date().getFullYear()} Opéra de Beyrouth. Tous droits réservés.
          </p>
          <p className="footer__copyright">Beyrouth, Liban</p>
        </div>
      </div>
    </footer>
  );
}
