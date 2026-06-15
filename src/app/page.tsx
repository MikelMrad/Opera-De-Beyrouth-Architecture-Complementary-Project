import Navbar from '@/components/Navbar/Navbar';
import Hero from '@/components/Hero/Hero';
import VideoEmbed from '@/components/VideoEmbed/VideoEmbed';
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

      <section className="home__video">
        <div className="home__video-inner">
          <div className="home__video-header">
            <p className="home__video-label">La Visite</p>
            <h2 className="home__video-title">Découvrez l&apos;Opéra en Vidéo</h2>
          </div>
          <VideoEmbed vimeoId="1201279550" title="Opéra de Beyrouth — Visite" />
        </div>
      </section>

      <AboutSection />

      <section className="home__auditoriums">
        <div className="home__auditoriums-inner">
          <div className="home__auditoriums-header">
            <p className="home__auditoriums-label">Nos Salles</p>
            <h2 className="home__auditoriums-title">Choisissez Votre Place</h2>
          </div>
          <div className="home__auditoriums-grid">
            <AuditoriumCard
              type="main"
              title="Grand Auditorium"
              capacity={1200}
              description={`Notre grande salle de 1200 places offre une acoustique de classe mondiale, une fosse d'orchestre complète et une machinerie de scène de pointe — conçue pour accueillir l'opéra, la symphonie et le ballet au plus haut niveau international.`}
            />
            <AuditoriumCard
              type="chamber"
              title="Petit Auditorium"
              capacity={600}
              description={`Une salle de 600 places à l'atmosphère chaleureuse, idéale pour la musique de chambre, les récitals et les représentations expérimentales. Son acoustique enveloppante et sa scénographie flexible créent un lien incomparable entre interprètes et public.`}
            />
          </div>
        </div>
      </section>

      {/* Horizontal pinned quote strip — animated by useScrollAnimations */}
      <HorizontalQuotes />

      <Footer />
    </>
  );
}
