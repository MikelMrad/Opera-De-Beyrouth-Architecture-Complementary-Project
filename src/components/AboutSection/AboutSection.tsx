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

        {/* Carousels — full-width, no text */}
        {carousel1.length > 0 && (
          <div className="about__fullwidth anim-scale-in">
            <Carousel slides={carousel1} interval={2000} imgWidth={1672} imgHeight={941} sizes="100vw" />
          </div>
        )}

        {carousel2.length > 0 && (
          <div className="about__fullwidth anim-scale-in">
            <Carousel slides={carousel2} interval={2000} imgWidth={1672} imgHeight={941} sizes="100vw" />
          </div>
        )}

        {carousel3.length > 0 && (
          <div className="about__fullwidth anim-scale-in">
            <Carousel slides={carousel3} interval={2000} imgWidth={1672} imgHeight={941} sizes="100vw" />
          </div>
        )}

        {carousel4.length > 0 && (
          <div className="about__fullwidth anim-scale-in">
            <Carousel slides={carousel4} interval={2000} imgWidth={1672} imgHeight={941} sizes="100vw" />
          </div>
        )}

        {carousel5.length > 0 && (
          <div className="about__fullwidth anim-scale-in">
            <Carousel slides={carousel5} interval={2000} imgWidth={1672} imgHeight={941} sizes="100vw" />
          </div>
        )}

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
