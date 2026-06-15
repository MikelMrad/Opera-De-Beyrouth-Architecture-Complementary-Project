'use client';

import { useEffect, useState } from 'react';
import './VideoEmbed.css';

interface VideoEmbedProps {
  /** Numeric Vimeo id — the number in vimeo.com/123456789 */
  vimeoId: string;
  /** Accessible label for the play button / iframe */
  title?: string;
  /** Optional poster image (path in /public). If omitted, Vimeo's own thumbnail is used. */
  poster?: string;
  /** Width / height, e.g. 16/9 or 4/3. If omitted, it's read from Vimeo. */
  aspectRatio?: number;
}

/**
 * Lazy Vimeo embed. Shows a lightweight poster + play button (the "facade")
 * and only loads the heavy player iframe once the user clicks — so the page
 * stays fast and the video streams adaptively from Vimeo on demand.
 */
export default function VideoEmbed({ vimeoId, title = 'Vidéo', poster, aspectRatio }: VideoEmbedProps) {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState<string | null>(poster ?? null);
  const [ratio, setRatio] = useState<number>(aspectRatio ?? 16 / 9);

  // Pull Vimeo's thumbnail + real dimensions (best-effort) so we don't need a
  // hardcoded poster or aspect ratio.
  useEffect(() => {
    if (!vimeoId || (poster && aspectRatio)) return;
    let cancelled = false;
    fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${vimeoId}&width=1280`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        if (!poster && d?.thumbnail_url) setThumb(d.thumbnail_url);
        if (!aspectRatio && d?.width && d?.height) setRatio(d.width / d.height);
      })
      .catch(() => { /* falls back to the poster/default ratio */ });
    return () => { cancelled = true; };
  }, [vimeoId, poster, aspectRatio]);

  return (
    <div className="video-embed" style={{ aspectRatio: String(ratio) }}>
      {playing ? (
        <iframe
          className="video-embed__iframe"
          src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="video-embed__facade"
          onClick={() => setPlaying(true)}
          aria-label={`Lire la vidéo : ${title}`}
          style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
        >
          <span className="video-embed__play">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
          </span>
        </button>
      )}
    </div>
  );
}
