'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import ThreeDViewer from '@/components/ThreeDViewer/ThreeDViewer';

const AUDITORIUM_LABELS: Record<string, string> = {
  main: 'Le Phénix',
  chamber: "Salle de l'Âme",
};

export default function ConfirmationContent() {
  const searchParams = useSearchParams();
  const seatsParam = searchParams.get('seats') ?? '';
  const auditorium = searchParams.get('auditorium') ?? 'main';

  const seatIds = seatsParam
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const firstSeat = seatIds[0] ?? '';
  const auditoriumLabel = AUDITORIUM_LABELS[auditorium] ?? auditorium;

  return (
    <>
      <Navbar />
      <main className="confirmation">
        <div className="confirmation__hero">
          <div className="confirmation__check" aria-hidden="true">✓</div>
          <h1 className="confirmation__title">Vos places sont confirmées</h1>
          <p className="confirmation__subtitle">
            Réservation enregistrée pour {auditoriumLabel}
          </p>
        </div>

        <div className="confirmation__body">
          <div className="confirmation__card anim-fade-up">
            <h2 className="confirmation__card-title">Récapitulatif</h2>

            <div className="confirmation__detail-row">
              <span className="confirmation__detail-label">Salle</span>
              <span className="confirmation__detail-value">{auditoriumLabel}</span>
            </div>

            <div className="confirmation__detail-row">
              <span className="confirmation__detail-label">
                Place{seatIds.length > 1 ? 's' : ''}
              </span>
              <span className="confirmation__detail-value">
                <span className="confirmation__seat-list">
                  {seatIds.length > 0 ? (
                    seatIds.map((id) => (
                      <span key={id} className="confirmation__seat-chip">
                        {id}
                      </span>
                    ))
                  ) : (
                    <span>—</span>
                  )}
                </span>
              </span>
            </div>

            <div className="confirmation__detail-row">
              <span className="confirmation__detail-label">Total</span>
              <span className="confirmation__detail-value">
                {seatIds.length} place{seatIds.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          <div className="confirmation__actions anim-fade-up">
            <Link href="/" className="confirmation__back-btn">
              ← Retour à l&apos;Accueil
            </Link>
            <Link
              href={`/reserve?auditorium=${auditorium}`}
              className="confirmation__back-btn"
            >
              Nouvelle Réservation
            </Link>
          </div>

          <div className="confirmation__3d-section anim-fade-up">
            <h2 className="confirmation__3d-title">Vue depuis votre place en 3D</h2>
            {firstSeat ? (
              <Link
                href={`/viewer?seat=${firstSeat}&auditorium=${auditorium}`}
                className="confirmation__3d-btn"
              >
                Lancer la Vue 3D — Place {firstSeat}
              </Link>
            ) : null}

            <ThreeDViewer seatId={firstSeat || undefined} auditorium={auditorium} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
