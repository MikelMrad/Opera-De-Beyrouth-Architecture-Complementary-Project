'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import './Carousel.css';

interface CarouselSlide {
  src: string;
  caption?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  interval?: number;
  imgWidth?: number;
  imgHeight?: number;
}

export default function Carousel({ slides, interval = 2000, imgWidth, imgHeight }: CarouselProps) {
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setActive(cur => {
      setPrev(cur);
      return (cur + 1) % slides.length;
    });
  }, [slides.length]);

  const goTo = (index: number) => {
    if (index === active) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setPrev(active);
    setActive(index);
  };

  useEffect(() => {
    if (slides.length < 2 || paused) return;
    timerRef.current = setTimeout(advance, interval);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, advance, interval, paused, slides.length]);

  const aspectRatio = imgWidth && imgHeight ? `${imgWidth} / ${imgHeight}` : undefined;

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="carousel__track"
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {slides.map((slide, i) => (
          <Image
            key={i}
            src={slide.src}
            alt={slide.caption ?? ''}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            className={`carousel__slide ${i === active ? 'carousel__slide--active' : ''} ${i === prev ? 'carousel__slide--prev' : ''}`}
          />
        ))}
      </div>

      {slides.length > 1 && (
        <div className="carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`carousel__dot ${i === active ? 'carousel__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
