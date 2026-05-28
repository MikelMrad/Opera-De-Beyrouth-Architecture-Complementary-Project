import './HorizontalQuotes.css';

// The horizontal scroll animation for this section is driven by
// useScrollAnimations (src/hooks/useScrollAnimations.ts) which pins
// .horiz-scroll-section and scrubs .horiz-scroll-track on the x-axis.

const QUOTES = [
  {
    text: 'La musique ne nous dit pas ce qui a été — elle révèle ce que nous avons toujours été.',
    attribution: 'Opéra de Beyrouth',
  },
  {
    text: 'Beyrouth ne tombe pas. Elle descend, accumule la lumière au fond de la mer, et remonte comme un soleil nouveau.',
    attribution: 'Mémoire & Lumière',
  },
  {
    text: 'Dans la salle d\'opéra, le son devient architecture. Chaque aria, une voûte de pierre tremblante.',
    attribution: 'Art & Espace',
  },
  {
    text: 'S\'asseoir dans l\'obscurité face à une scène éclairée est un acte d\'espoir. Le plus ancien que nous connaissions.',
    attribution: 'Le Spectacle Vivant',
  },
] as const;

export default function HorizontalQuotes() {
  return (
    <section
      className="horiz-scroll-section"
      aria-label="Citations — Opéra de Beyrouth"
    >
      <div className="horiz-scroll-track" role="list">
        {QUOTES.map((quote, i) => (
          <article className="quote-card" key={i} role="listitem">
            <span className="quote-card__index">
              0{i + 1} / 0{QUOTES.length}
            </span>
            <div className="quote-card__ornament" aria-hidden="true" />
            <p className="quote-card__text">{quote.text}</p>
            <p className="quote-card__attribution">{quote.attribution}</p>
          </article>
        ))}
      </div>

      {/* Dot indicators — purely decorative */}
      <div className="horiz-scroll-dots" aria-hidden="true">
        {QUOTES.map((_, i) => (
          <span key={i} className="horiz-scroll-dot" />
        ))}
      </div>
    </section>
  );
}
