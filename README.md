# Opéra de Beyrouth

A full-stack seat-reservation web application for Opéra de Beyrouth — Beirut's first world-class opera house.

Built with **Next.js 15 App Router**, **TypeScript**, **MUI v6**, **Firebase Firestore**, and **GSAP ScrollTrigger**.

---

## What You Need to Provide

### 1. Firebase Configuration

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project (or use an existing one)
3. Enable **Firestore Database** in Native mode
4. Register a **Web App** under Project Settings → General → Your Apps
5. Copy the config values into `.env.local` (see below)

Firestore collections used:
- `reservations` — one document per booking (`seatIds`, `auditorium`, `name`, `email`, `timestamp`)
- `seats` — one document per reserved seat, keyed as `{auditorium}_{seatId}` (e.g. `main_A1`)

**Recommended Firestore security rules** (set in Firebase Console):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{id} {
      allow read: if false;
      allow create: if request.auth == null; // open for now; add auth later
    }
    match /seats/{id} {
      allow read: if true;
      allow write: if request.auth == null; // open for now; add auth later
    }
  }
}
```

### 2. Real Images

Replace the CSS color-block placeholders by updating the relevant `.css` files:

| Slot | File | Class | Description |
|------|------|-------|-------------|
| `IMAGE_1` | `src/components/Hero/Hero.css` | `.hero__bg` | Front facade of Opéra de Beyrouth |
| `IMAGE_2` | `src/components/AboutSection/AboutSection.css` | `.about__image-slot--2` | Side view of opera exterior |
| `IMAGE_3` | `src/components/AboutSection/AboutSection.css` | `.about__image-slot--3` | Interior architectural render |
| `IMAGE_4` | `src/components/AboutSection/AboutSection.css` | `.about__image-slot--4` | Stage close-up |

Place image files in `/public/images/` and add e.g.:
```css
.hero__bg {
  background-image: url('/images/facade.jpg');
  background-size: cover;
  background-position: center;
}
```

### 3. 3D Viewer GLB Model

Place your auditorium `.glb` file at `/public/models/auditorium.glb`.

Implementation steps are documented in `src/components/ThreeDViewer/ThreeDViewer.tsx`.
Three.js is already installed. You will also need `@react-three/fiber` and `@react-three/drei`.

---

## How to Run

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# then edit .env.local with your Firebase values

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
  app/
    page.tsx              Landing page (/)
    reserve/page.tsx      Reservation page (/reserve?auditorium=main|chamber)
    confirmation/page.tsx Confirmation page (/confirmation?seats=A1,A2&auditorium=main)
    globals.css           CSS variables + resets
    layout.tsx            Root layout — MonteCarlo, Cormorant Garamond, Inter
  components/
    Navbar/               Fixed navbar with scroll-state toggle (.navbar--scrolled)
    Hero/                 Full-screen hero, title split into char spans (GSAP stagger)
    AboutSection/         About section with IMAGE_2, IMAGE_3, IMAGE_4 slots
    AuditoriumCard/       Venue card (.anim-fade-up)
    HorizontalQuotes/     GSAP-pinned horizontal scroll quote strip
    SeatMap/              Interactive SVG seat map (Le Phénix)
    SeatMap2/             Salle de l'Âme seat map (delegates to SeatMap)
    ThreeDViewer/         3D seat viewer placeholder (Three.js)
    Footer/               Site footer
    AnimationsInit/       Client wrapper that calls useScrollAnimations on route change
  hooks/
    useScrollAnimations.ts  All GSAP ScrollTrigger setup (h2 wipe, fade-up batch, scale-in, footer, horizontal scroll)
  lib/
    firebase.ts           Firebase initialization
    seats.ts              Firestore helpers: getReservedSeats, reserveSeats, subscribeToSeats
  types/
    index.ts              Shared TypeScript types
```

---

## Seat IDs

Seats are identified as `{Row}{Number}` — e.g. `A1`, `B14`, `O3`.

**Le Phénix — Main Auditorium (350 seats)**
- Orchestra: rows A–N, 20 seats per row
- Balcony: rows O–R, 12 seats per row

**Salle de l'Âme — Chamber Hall (150 seats)**
- Floor: rows A–G, 18 seats per row
- Mezzanine: rows H–J, 9 seats per row

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI Components | MUI v6 |
| Styling | Pure CSS (`.css` files, CSS custom properties) |
| Fonts | MonteCarlo · Cormorant Garamond · Inter via `next/font/google` |
| Animations | GSAP ScrollTrigger |
| Database | Firebase Firestore v9 (modular SDK) |
| 3D (placeholder) | Three.js |
