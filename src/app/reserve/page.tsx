import { Suspense } from 'react';
import ReserveContent from './ReserveContent';
import './page.css';

export default function ReservePage() {
  return (
    <Suspense fallback={<div className="reserve__loading">Loading seat availability…</div>}>
      <ReserveContent />
    </Suspense>
  );
}
