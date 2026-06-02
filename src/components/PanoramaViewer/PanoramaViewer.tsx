'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './PanoramaViewer.css';

interface PanoramaViewerProps {
  /** Path to the equirectangular (2:1) panorama JPG. */
  src: string;
}

const MIN_FOV = 40;
const MAX_FOV = 90;
const SPHERE_R = 500;

/**
 * Pure-Three.js equirectangular 360° viewer.
 *
 * An inverted sphere is textured with the panorama on its inside; the camera
 * sits at the centre and we rotate the *look-at* target with mouse / touch
 * drag (inertia on release), pinch / wheel to zoom. The chrome (badge, close,
 * hint) lives in PanoramaModal — this component is just the canvas.
 *
 * lon/lat 0,0 looks toward +x, which — because the geometry is flipped on x —
 * is the horizontal centre of the image (the stage).
 */
export default function PanoramaViewer({ src }: PanoramaViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 0.1, 1100);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Inverted sphere so we see the texture from the inside.
    const geometry = new THREE.SphereGeometry(SPHERE_R, 60, 40);
    geometry.scale(-1, 1, 1);

    const texture = new THREE.TextureLoader().load(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // ---- view state (degrees) ----
    let lon = 0;
    let lat = 0;
    let lonV = 0; // angular velocity, drives the inertia on release
    let latV = 0;

    // ---- pointer / gesture tracking ----
    const pointers = new Map<number, { x: number; y: number }>();
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pinchDist = 0;

    const el = renderer.domElement;
    el.style.touchAction = 'none';

    const onPointerDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        dragging = true;
        lastX = e.clientX;
        lastY = e.clientY;
        lonV = 0;
        latV = 0;
      } else if (pointers.size === 2) {
        // second finger down → switch from drag to pinch
        dragging = false;
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
      el.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointers.size >= 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0) {
          camera.fov = THREE.MathUtils.clamp(
            camera.fov - (dist - pinchDist) * 0.1,
            MIN_FOV,
            MAX_FOV,
          );
          camera.updateProjectionMatrix();
        }
        pinchDist = dist;
        return;
      }

      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      // tie drag speed to fov so a zoomed-in view pans more slowly
      const speed = camera.fov / height;
      lonV = -dx * speed;
      latV = dy * speed;
      lon += lonV;
      lat += latV;
    };

    const endPointer = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0) dragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.fov = THREE.MathUtils.clamp(camera.fov + e.deltaY * 0.05, MIN_FOV, MAX_FOV);
      camera.updateProjectionMatrix();
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', endPointer);
    el.addEventListener('pointercancel', endPointer);
    el.addEventListener('wheel', onWheel, { passive: false });

    // ---- keep the canvas filling its container ----
    const ro = new ResizeObserver(() => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    ro.observe(container);

    // ---- render loop ----
    let raf = 0;
    const target = new THREE.Vector3();
    const animate = () => {
      raf = requestAnimationFrame(animate);

      // glide with decaying velocity once the user lets go
      if (!dragging && pointers.size === 0) {
        lon += lonV;
        lat += latV;
        lonV *= 0.94;
        latV *= 0.94;
        if (Math.abs(lonV) < 0.001) lonV = 0;
        if (Math.abs(latV) < 0.001) latV = 0;
      }

      lat = Math.max(-85, Math.min(85, lat));
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon);
      target.set(
        SPHERE_R * Math.sin(phi) * Math.cos(theta),
        SPHERE_R * Math.cos(phi),
        SPHERE_R * Math.sin(phi) * Math.sin(theta),
      );
      camera.lookAt(target);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', endPointer);
      el.removeEventListener('pointercancel', endPointer);
      el.removeEventListener('wheel', onWheel);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
    };
  }, [src]);

  return <div ref={containerRef} className="panorama-viewer" />;
}
