import { getCarouselSlides } from '@/lib/getCarouselSlides';
import Carousel from '@/components/Carousel/Carousel';
import GalleryGrid from '@/components/GalleryGrid/GalleryGrid';
import './AboutSection.css';

export default function AboutSection() {
  const galleryImages = getCarouselSlides('gallery').map(s => s.src);
  const carousel1 = getCarouselSlides('carousel1');
  const carousel2 = getCarouselSlides('carousel2');
  const carousel3 = getCarouselSlides('carousel3');
  const carousel4 = getCarouselSlides('carousel4');
  const carousel5 = getCarouselSlides('carousel5');
  const carousel6 = getCarouselSlides('carousel6');

  return (
    <section className="about" id="about">
      <div className="about__inner">
        <div className="about__header">
          <p className="about__label">Notre Histoire</p>
          <h2 className="about__title">L’Opéra des Confluences Beyrouthine</h2>
          <p className="about__intro anim-fade-up">
            Diapason unificateur de la mosaïque sociale libanaise
          </p>
        </div>

        {/* Row 1: carousel left, text right */}
        {carousel1.length > 0 && (
          <div className="about__row">
            <div className="about__carousel-slot anim-scale-in">
              <Carousel slides={carousel1} interval={2000} imgWidth={1672} imgHeight={941} />
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
        )}

        {/* Row 2: text left, carousel right */}
        {carousel2.length > 0 && (
          <div className="about__row about__row--reverse">
            <div className="about__carousel-slot anim-scale-in">
              <Carousel slides={carousel2} interval={2000} imgWidth={1672} imgHeight={941} />
            </div>
            <div className="about__text">
              <h3>Excellence Acoustique</h3>
              <p className="anim-fade-up">
                La salle Grand Auditorium, 1200 places, a été conçue en
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
        )}

        {/* Row 3: carousel left, text right */}
        {carousel3.length > 0 && (
          <div className="about__row">
            <div className="about__carousel-slot anim-scale-in">
              <Carousel slides={carousel3} interval={2000} imgWidth={1672} imgHeight={941} />
            </div>
            <div className="about__text">
              <h3>L&apos;Intimité du Petit Auditorium</h3>
              <p className="anim-fade-up">
                Avec ses 600 places disposées au plus près de la
                scène, la Petit Auditorium a été pensée pour la musique de chambre, les
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
        )}

        {/* Row 4: text left, carousel right */}
        {carousel4.length > 0 && (
          <div className="about__row about__row--reverse">
            <div className="about__carousel-slot anim-scale-in">
              <Carousel slides={carousel4} interval={2000} imgWidth={1672} imgHeight={941} />
            </div>
            <div className="about__text">
              <h3>Une Programmation d&apos;Exception</h3>
              <p className="anim-fade-up">
                Du grande tradition lyrique aux créations contemporaines,
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
        )}

        {/* Row 5: carousel left, text right */}
        {carousel5.length > 0 && (
          <div className="about__row">
            <div className="about__carousel-slot anim-scale-in">
              <Carousel slides={carousel5} interval={2000} imgWidth={1672} imgHeight={941} />
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
        )}

        {/* Row 6: full-width, no text */}
        {carousel6.length > 0 && (
          <div className="about__fullwidth anim-scale-in">
            <Carousel slides={carousel6} interval={2000} imgWidth={1672} imgHeight={941} sizes="100vw" />
          </div>
        )}

        {/* Bento image gallery */}
        <GalleryGrid images={galleryImages} />

      </div>
    </section>
  );
}
