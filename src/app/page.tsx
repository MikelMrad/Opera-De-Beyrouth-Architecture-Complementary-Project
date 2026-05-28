import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import AboutSection from '@/components/AboutSection/AboutSection';
import AuditoriumCard from '@/components/AuditoriumCard/AuditoriumCard';
import HorizontalQuotes from '@/components/HorizontalQuotes/HorizontalQuotes';
import Footer from '@/components/Footer/Footer';
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
              capacity={350}
              description="Notre grande salle de 350 places offre une acoustique de classe mondiale, une fosse d'orchestre complète et une machinerie de scène de pointe — conçue pour accueillir l'opéra, la symphonie et le ballet au plus haut niveau international."
            />
            <AuditoriumCard
              type="chamber"
              title="Salle de l'Âme"
              capacity={150}
              description="Un espace intime de 150 places, idéal pour la musique de chambre, les récitals et les représentations expérimentales. Son acoustique chaleureuse et sa scénographie flexible créent un lien incomparable entre interprètes et public."
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
