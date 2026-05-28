'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import SeatMap from '@/components/SeatMap/SeatMap';
import SeatMap2 from '@/components/SeatMap2/SeatMap2';
import { subscribeToSeats, reserveSeats } from '@/lib/seats';
import type { Auditorium } from '@/types';

const MAX_SEATS = 4;

const AUDITORIUM_LABELS: Record<Auditorium, string> = {
  main: 'Le Phénix',
  chamber: "Salle de l'Âme",
};

export default function ReserveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auditoriumParam = searchParams.get('auditorium');
  const auditorium: Auditorium =
    auditoriumParam === 'chamber' ? 'chamber' : 'main';

  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [firestoreError, setFirestoreError] = useState('');

  useEffect(() => {
    setLoading(true);
    setFirestoreError('');
    const unsub = subscribeToSeats(auditorium, (ids, err) => {
      if (err) {
        setFirestoreError(
          err.message.includes('index')
            ? 'Firestore index manquant — créez l\'index composite dans la console Firebase (lien dans la console du navigateur).'
            : `Erreur Firestore : ${err.message}`
        );
      }
      setReservedIds(ids);
      setLoading(false);
    });
    return unsub;
  }, [auditorium]);

  useEffect(() => {
    setSelectedIds((prev) => prev.filter((id) => !reservedIds.includes(id)));
  }, [reservedIds]);

  const handleSeatClick = useCallback((id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_SEATS) return prev;
      return [...prev, id];
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (selectedIds.length === 0) {
      setError('Veuillez sélectionner au moins une place.');
      return;
    }
    if (!name.trim() || !email.trim()) {
      setError('Veuillez renseigner votre nom et votre adresse e-mail.');
      return;
    }

    setSubmitting(true);
    try {
      await reserveSeats(selectedIds, auditorium, name.trim(), email.trim());
      router.push(
        `/confirmation?seats=${selectedIds.join(',')}&auditorium=${auditorium}`
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'La réservation a échoué. Veuillez réessayer.'
      );
      setSubmitting(false);
    }
  };

  const title = AUDITORIUM_LABELS[auditorium];

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="reserve">
          <div className="reserve__hero">
            <p className="reserve__hero-label">Réservez Vos Places</p>
            <h1 className="reserve__hero-title">{title}</h1>
          </div>
          <div className="reserve__loading">Chargement des disponibilités…</div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="reserve">
        <div className="reserve__hero">
          <p className="reserve__hero-label">Réservez Vos Places</p>
          <h1 className="reserve__hero-title">{title}</h1>
        </div>

        <div className="reserve__body">
          {firestoreError && (
            <p className="reserve__error">{firestoreError}</p>
          )}
          {auditorium === 'main' ? (
            <SeatMap
              auditorium="main"
              reservedIds={reservedIds}
              selectedIds={selectedIds}
              onSeatClick={handleSeatClick}
              maxSelection={MAX_SEATS}
            />
          ) : (
            <SeatMap2
              reservedIds={reservedIds}
              selectedIds={selectedIds}
              onSeatClick={handleSeatClick}
              maxSelection={MAX_SEATS}
            />
          )}

          <div className="reserve__form-card">
            <h2 className="reserve__form-title">Vos Coordonnées</h2>
            <form className="reserve__form" onSubmit={handleSubmit} noValidate>
              <div className="reserve__form-row">
                <TextField
                  label="Nom Complet"
                  variant="outlined"
                  fullWidth
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  slotProps={{ htmlInput: { 'aria-label': 'Nom complet' } }}
                />
                <TextField
                  label="Adresse E-mail"
                  variant="outlined"
                  type="email"
                  fullWidth
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  slotProps={{ htmlInput: { 'aria-label': 'Adresse e-mail' } }}
                />
              </div>

              {error && <p className="reserve__error">{error}</p>}

              <div className="reserve__submit-row">
                <p className="reserve__seat-summary">
                  {selectedIds.length > 0
                    ? `${selectedIds.length} place${selectedIds.length > 1 ? 's' : ''} sélectionnée${selectedIds.length > 1 ? 's' : ''} : ${selectedIds.join(', ')}`
                    : 'Aucune place sélectionnée'}
                </p>
                <button
                  type="submit"
                  className="reserve__submit-btn"
                  disabled={submitting || selectedIds.length === 0}
                >
                  {submitting ? 'Confirmation en cours…' : 'Confirmer la Réservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
