import { Suspense } from 'react';
import ConfirmationContent from './ConfirmationContent';
import './page.css';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="confirmation__loading">Loading…</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
