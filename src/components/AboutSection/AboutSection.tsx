import { SEAT_TOTALS_ROUNDED } from '@/lib/seatCounts';
import Carousel from '@/components/Carousel/Carousel';
import './AboutSection.css';

const carouselSlides = [
  { src: '/images/carousel/1.png', caption: 'Façade Latérale, Opéra de Beyrouth' },
  { src: '/images/carousel/2.png', caption: 'Grand Foyer' },
  { src: '/images/carousel/3.png', caption: 'Vue Extérieure' },
];

export default function AboutSection() {
  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__header">
          <p className="about__label">Notre Histoire</p>
          <h2 className="about__title">Une Renaissance Culturelle pour Beyrouth</h2>
          <p className="about__intro anim-fade-up">
            Surgissant du cœur de la ville, l&apos;Opéra de Beyrouth témoigne de l&apos;esprit
            indéfectible du Liban — un foyer d&apos;excellence artistique qui honore le passé
            et embrasse l&apos;avenir.
          </p>
        </div>

        {/* Row 1: carousel left, text right */}
        <div className="about__row">
          <div className="about__image-slot anim-scale-in" style={{ padding: 0 }}>
            <Carousel slides={carouselSlides} interval={2000} />
          </div>

          <div className="about__text">
            <h3>Architecture &amp; Vision</h3>
            <p className="anim-fade-up">
              Conçu par un studio de renommée internationale, l&apos;édifice entrelace
              les motifs architecturaux libanais traditionnels dans une silhouette
              contemporaine. L&apos;atrium de verre soaring, orné d&apos;une treillis de cèdre
              sculpté à la main, inonde le Grand Foyer d&apos;une lumière méditerranéenne naturelle.
            </p>
            <p className="anim-fade-up">
              Chaque matériau a été choisi avec soin : marbre libanais, laiton artisanal
              et pierre d&apos;origine locale jalonnent les espaces publics, ancrant ce monument
              dans le paysage qui l&apos;abrite.
            </p>
          </div>
        </div>

        {/* Row 2: text left, image right */}
        <div className="about__row about__row--reverse">
          {/* IMAGE_3: Interior architectural render
              Replace background-color with actual image in AboutSection.css */}
          <div className="about__image-slot about__image-slot--3 anim-scale-in">
            <span className="about__image-caption">Le Phénix — Rendu Intérieur</span>
          </div>

          <div className="about__text">
            <h3>Excellence Acoustique</h3>
            <p className="anim-fade-up">
              La salle Le Phénix, 1200 places, a été conçue en
              collaboration avec les plus grands acousticiens pour atteindre les temps de
              réverbération exigés par le grand opéra, le concert symphonique et le ballet.
            </p>
            <p className="anim-fade-up">
              Panneaux de bois courbés, surfaces diffusantes précisément inclinées et
              sièges capitonnés sur mesure convergent dans un environnement où chaque
              murmure de l&apos;orchestre atteint chaque auditeur avec la même clarté et la même chaleur.
            </p>
          </div>
        </div>

        {/* Row 3: image left, text right — Salle de l'Âme */}
        <div className="about__row">
          {/* IMAGE_5: Salle de l'Âme interior render
              Replace background-color with actual image in AboutSection.css */}
          <div className="about__image-slot about__image-slot--5 anim-scale-in">
            <span className="about__image-caption">Salle de l&apos;Âme — Rendu Intérieur</span>
          </div>

          <div className="about__text">
            <h3>L&apos;Intimité de la Salle de l&apos;Âme</h3>
            <p className="anim-fade-up">
              Avec ses 600 places disposées au plus près de la
              scène, la Salle de l&apos;Âme a été pensée pour la musique de chambre, les
              récitals et la création contemporaine — un écrin où chaque souffle de
              l&apos;interprète demeure perceptible.
            </p>
            <p className="anim-fade-up">
              Sa scénographie modulable et son acoustique enveloppante abolissent la
              distance entre la scène et le public, faisant de chaque représentation une
              rencontre profondément intime.
            </p>
          </div>
        </div>

        {/* Full-width image: Stage */}
        {/* IMAGE_4: Stage close-up
            Replace background-color with actual image in AboutSection.css */}
        <div className="about__image-slot about__image-slot--4 anim-scale-in">
          <span className="about__image-caption">La Scène — Le Phénix</span>
        </div>

        {/* Stats */}
        <div className="about__stats">
          <div className="about__stat anim-fade-up">
            <p className="about__stat-number">1200</p>
            <p className="about__stat-label"> — Le Phénix</p>
          </div>
          <div className="about__stat anim-fade-up">
            <p className="about__stat-number">600</p>
            <p className="about__stat-label">Places — Salle de l&apos;Âme</p>
          </div>
          <div className="about__stat anim-fade-up">
            <p className="about__stat-number">2</p>
            <p className="about__stat-label">Espaces de Représentation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
