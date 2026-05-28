'use client';

// =====================================================================
// THREE.JS VIEWER — PLACEHOLDER
//
// This component is intentionally left as a placeholder.
// To implement:
//   1. Place your auditorium .glb file in /public/models/auditorium.glb
//   2. Install @react-three/fiber and @react-three/drei (or use Three.js directly)
//   3. Load the GLB via useGLTF (drei) or THREE.GLTFLoader
//   4. Position the camera at the seat coordinates passed via `seatId`
//   5. Seat coordinates should be defined in a lookup table (e.g. lib/seatCoords.ts)
//      mapping seatId → { x, y, z, lookAt: { x, y, z } }
//
// Three.js is already installed in this project.
// =====================================================================

import './ThreeDViewer.css';

interface ThreeDViewerProps {
  seatId?: string;
  auditorium?: string;
}

export default function ThreeDViewer({ seatId, auditorium }: ThreeDViewerProps) {
  return (
    <div className="threed-viewer">
      <span className="threed-viewer__icon">◉</span>
      <p className="threed-viewer__placeholder-text">
        3D Seat View — Placeholder
      </p>
      {seatId && (
        <p className="threed-viewer__placeholder-text">
          Seat: {seatId} · {auditorium ?? '—'}
        </p>
      )}
      {/* Three.js canvas will be mounted here once implemented */}
      <div className="threed-viewer__canvas-mount" id="threed-canvas-mount" />
    </div>
  );
}
