import { SEAT_TOTALS_ROUNDED } from '@/lib/seatCounts';
import Carousel from '@/components/Carousel/Carousel';
import './AboutSection.css';

const carousel1Slides = [
  { src: '/images/carousel1/1.webp', caption: 'Façade Latérale, Opéra de Beyrouth' },
  { src: '/images/carousel1/2.webp', caption: 'Grand Foyer' },
  { src: '/images/carousel1/3.webp', caption: 'Vue Extérieure' },
];

const carousel2Slides = [
  { src: '/images/carousel2/1.webp', caption: 'Le Phénix — Rendu Intérieur' },
  { src: '/images/carousel2/2.webp', caption: 'Le Phénix — Vue de Scène' },
  { src: '/images/carousel2/3.webp', caption: 'Le Phénix — Balcon' },
];

const carousel3Slides = [
  { src: '/images/carousel3/1.webp', caption: 'Salle de l\'Âme — Rendu Intérieur' },
  { src: '/images/carousel3/2.webp', caption: 'Salle de l\'Âme — Scène' },
  { src: '/images/carousel3/3.webp', caption: 'Salle de l\'Âme — Vue du Public' },
];

const carousel4Slides = [
  { src: '/images/carousel4/1.webp', caption: 'La Scène — Le Phénix' },
  { src: '/images/carousel4/2.webp', caption: 'Coulisses — Le Phénix' },
  { src: '/images/carousel4/3.webp', caption: 'Plateau — Vue Panoramique' },
];

const carousel5Slides = [
  { src: '/images/carousel5/1.webp', caption: 'Programmation Artistique' },
  { src: '/images/carousel5/2.webp', caption: 'Saison Lyrique' },
  { src: '/images/carousel5/3.webp', caption: 'Gala d\'Ouverture' },
];

const carousel6Slides = [
  { src: '/images/carousel6/1.webp', caption: 'Ateliers Jeunesse' },
  { src: '/images/carousel6/2.webp', caption: 'Résidences d\'Artistes' },
  { src: '/images/carousel6/3.webp', caption: 'Rayonnement Culturel' },
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
          <div className="about__carousel-slot anim-scale-in">
            <Carousel slides={carousel1Slides} interval={2000} imgWidth={1672} imgHeight={941} />
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

        {/* Row 2: text left, carousel right */}
        <div className="about__row about__row--reverse">
          <div className="about__carousel-slot anim-scale-in">
            <Carousel slides={carousel2Slides} interval={2000} imgWidth={1672} imgHeight={941} />
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

        {/* Row 3: carousel left, text right */}
        <div className="about__row">
          <div className="about__carousel-slot anim-scale-in">
            <Carousel slides={carousel3Slides} interval={2000} imgWidth={1672} imgHeight={941} />
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

        {/* Row 4: text left, carousel right */}
        <div className="about__row about__row--reverse">
          <div className="about__carousel-slot anim-scale-in">
            <Carousel slides={carousel5Slides} interval={2000} imgWidth={1672} imgHeight={941} />
          </div>
          <div className="about__text">
            <h3>Une Programmation d&apos;Exception</h3>
            <p className="anim-fade-up">
              De la grande tradition lyrique aux créations contemporaines,
              chaque saison tisse un dialogue entre patrimoine et avant-garde.
              Les plus grands noms de la scène internationale se produisent
              aux côtés des talents émergents du monde arabe.
            </p>
            <p className="anim-fade-up">
              Opéras, ballets, concerts symphoniques et récitals se succèdent
              dans un calendrier conçu pour toucher tous les publics et
              célébrer la diversité des expressions artistiques.
            </p>
          </div>
        </div>

        {/* Row 5: carousel left, text right */}
        <div className="about__row">
          <div className="about__carousel-slot anim-scale-in">
            <Carousel slides={carousel6Slides} interval={2000} imgWidth={1672} imgHeight={941} />
          </div>
          <div className="about__text">
            <h3>Rayonnement &amp; Transmission</h3>
            <p className="anim-fade-up">
              L&apos;Opéra de Beyrouth s&apos;engage au-delà de ses murs : ateliers
              pédagogiques, résidences de création et partenariats avec les
              écoles et universités du pays font de cet édifice un véritable
              foyer de transmission artistique.
            </p>
            <p className="anim-fade-up">
              En formant les artistes et les publics de demain, l&apos;institution
              ancre son rôle dans la durée — gardienne vivante d&apos;une culture
              qui se réinvente sans jamais s&apos;effacer.
            </p>
          </div>
        </div>

        {/* Full-width carousel: Stage */}
        <div className="about__fullwidth anim-scale-in">
          <Carousel slides={carousel4Slides} interval={2000} imgWidth={1672} imgHeight={941} />
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
