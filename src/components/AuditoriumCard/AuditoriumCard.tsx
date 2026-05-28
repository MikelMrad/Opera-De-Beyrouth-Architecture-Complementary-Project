import Link from 'next/link';
import type { Auditorium } from '@/types';
import './AuditoriumCard.css';

interface AuditoriumCardProps {
  type: Auditorium;
  title: string;
  capacity: number;
  description: string;
}

export default function AuditoriumCard({
  type,
  title,
  capacity,
  description,
}: AuditoriumCardProps) {
  return (
    // .anim-fade-up — GSAP ScrollTrigger.batch handles staggered entrance
    <Link href={`/reserve?auditorium=${type}`} className="card anim-fade-up">
      <span className="card__label">Réserver</span>
      <h3 className="card__title">{title}</h3>
      <p className="card__capacity">{capacity} places</p>
      <p className="card__description">{description}</p>
      <span className="card__cta">
        Réserver <span className="card__arrow">→</span>
      </span>
    </Link>
  );
}
