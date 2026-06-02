import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import AboutSection from '@/components/AboutSection/AboutSection';
import AuditoriumCard from '@/components/AuditoriumCard/AuditoriumCard';
import HorizontalQuotes from '@/components/HorizontalQuotes/HorizontalQuotes';
import Footer from '@/components/Footer/Footer';
import { SEAT_TOTALS_ROUNDED } from '@/lib/seatCounts';
import './page.css';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />

      <section className="home__auditoriums">
        <div className="home__auditoriums-inner">
          <div className="home__auditoriums-header">
            <p className="home__auditoriums-label">Nos Salles</p>
            <h2 className="home__auditoriums-title">Choisissez Votre Espace</h2>
          </div>
          <div className="home__auditoriums-grid">
            <AuditoriumCard
              type="main"
              title="Le Phénix"
              capacity={SEAT_TOTALS_ROUNDED.main}
              description={`Notre grande salle de ${SEAT_TOTALS_ROUNDED.main} places offre une acoustique de classe mondiale, une fosse d'orchestre complète et une machinerie de scène de pointe — conçue pour accueillir l'opéra, la symphonie et le ballet au plus haut niveau international.`}
            />
            <AuditoriumCard
              type="chamber"
              title="Salle de l'Âme"
              capacity={SEAT_TOTALS_ROUNDED.chamber}
              description={`Une salle de ${SEAT_TOTALS_ROUNDED.chamber} places à l'atmosphère chaleureuse, idéale pour la musique de chambre, les récitals et les représentations expérimentales. Son acoustique enveloppante et sa scénographie flexible créent un lien incomparable entre interprètes et public.`}
            />
          </div>
        </div>
      </section>

      <AboutSection />

      {/* Horizontal pinned quote strip — animated by useScrollAnimations */}
      <HorizontalQuotes />

      <Footer />
    </>
  );
}
