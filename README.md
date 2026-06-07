# Vitae — CV Builder v3.0

A premium, mobile-first curriculum vitae builder designed for professionals who value both design and efficiency. Create high-end, ATS-ready resumes with real-time preview, installable as a PWA on any device.

## Features

### Mobile-First UX

- **Bottom Navigation**: 4-tab navigation bar (Edit / Preview / Design / Profile) fixed at the bottom on mobile.
- **Full-Screen Panels**: Each tab occupies the full screen on mobile for distraction-free editing.
- **Scaled Preview**: The A4/Letter CV scales automatically to fit any screen width — no horizontal scroll.
- **Slide-In Drawer**: Hamburger menu opens a side drawer to manage all your saved CVs.
- **Touch-Friendly**: All interactive elements meet the 44px minimum touch target. Inputs use `font-size: 16px` to prevent iOS auto-zoom.
- **Safe-Area Support**: Header and bottom nav respect `env(safe-area-inset-*)` for notched devices (iPhone, etc.).
- **PWA Installable**: Add Vitae to your home screen on iOS and Android via the browser's "Add to Home Screen" option.

### Visual Customization

- **Dynamic Themes**: Choose from 10 curated master themes (Classic Burgundy, Midnight Blue, Modern Teal, etc.).
- **3 Resume Templates**: Modern (2-column with contact bar), Executive Slate (centered single column), and Timeline (vertical timeline layout).
- **Advanced Layouts**: Balanced 2-Column, Side-Left, Side-Right, and Single Column structures.
- **Color Harmony**: Full control over primary, accent, contact bar, and text colors via hex picker.
- **Typography Control**: Font family selector (Google Fonts), per-element font size adjustments, and line-height controls.

### Editing Experience

- **Smart Date Pickers**: Custom date range pickers with "Present" toggle and manual text override.
- **Drag & Drop Reordering**: Reorder experiences, education, certifications, skills, and interests.
- **Profile Image**: Upload with layout auto-adaptation when image is hidden.
- **Undo / Redo**: 50-state history for all edits (desktop).
- **Inline Editing**: Click-to-edit text directly on the CV preview (desktop).

### Content Sections

- Personal info & contact details (configurable contact bar layouts)
- Professional experience
- Education
- Courses & certifications
- Projects (with GitHub/demo links and tech tags)
- Skills & interests (tag-based)
- Languages (with proficiency level bars)
- Custom sections (user-defined title and items)

### Data Management

- **Local Persistence**: All data stored securely in IndexedDB — no server, no account required.
- **Multi-Resume Support**: Create, duplicate, rename, and delete multiple CVs.
- **Translation**: Create language copies (English / Portuguese) with one click.
- **JSON Backup**: Full export/import of all resumes as a JSON file.
- **TXT Import**: Paste a plain-text CV and have it parsed into structured fields.
- **Dark Mode**: Full dark mode across all panels and components.

### PDF Export

- **Direct PDF**: `jsPDF` + `html2canvas` pipeline with multi-page support (A4 or Letter).
- **Print Dialog**: Native browser print with `@media print` CSS for pixel-perfect output.
- **CV Score**: Real-time completeness indicator with actionable tips (0–100%).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) LTS
- [pnpm](https://pnpm.io/) (`npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install

# Start dev server (http://localhost:5001)
pnpm dev

# Production build
pnpm build
```

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 (local, via `@tailwindcss/vite`) |
| Animations | tailwindcss-animate |
| Icons | Lucide React |
| PDF | jsPDF + html2canvas |
| Storage | IndexedDB (offline, no server) |
| PWA | Web App Manifest + standalone display |

## Project Structure

```
/
├── App.tsx                    # Root component — layout, state, mobile logic
├── index.css                  # Tailwind v4 entry + custom animations + print CSS
├── hooks/
│   └── useIsMobile.ts         # Debounced mobile breakpoint hook
├── components/
│   ├── common/
│   │   ├── BottomNav.tsx      # Mobile 4-tab bottom navigation bar
│   │   ├── BottomSheet.tsx    # Slide-up modal sheet (mobile)
│   │   ├── DrawerNav.tsx      # Slide-in left drawer (mobile CVs list)
│   │   ├── Modal.tsx          # Desktop modal (confirm / prompt / select)
│   │   └── Toast.tsx          # Toast notification system
│   ├── editor/                # Form components for each CV section
│   └── resume/                # Read-only CV rendering components + templates
├── utils/
│   ├── db.ts                  # IndexedDB CRUD operations
│   ├── resumeParser.ts        # Plain-text CV parser
│   └── dateUtils.ts           # Date formatting helpers
└── public/
    ├── favicon.svg            # Vitae "V" logo (teal on dark)
    └── manifest.webmanifest   # PWA manifest
```

## Changelog

### v3.0.0

- **Rebrand**: App renamed from "CV Builder" to **Vitae**.
- **Mobile**: Complete mobile-first UX with bottom navigation, full-screen panels, and scaled CV preview.
- **Mobile**: Slide-in DrawerNav for CV management on small screens.
- **Mobile**: Touch-friendly inputs (44px targets, 16px font-size to prevent iOS zoom).
- **Mobile**: Safe-area-inset support for notched devices.
- **PWA**: `manifest.webmanifest` with standalone display mode and theme color.
- **Build**: Migrated from Tailwind CDN to local `@tailwindcss/vite` plugin (Tailwind v4).
- **Build**: Added `tailwindcss-animate` for slide-up / slide-in animations.

### v2.0.0

- **Feat**: 3 resume templates (Modern, Executive Slate, Minimalist Timeline).
- **Feat**: Projects section with links and tech tags.
- **Feat**: Custom sections with user-defined titles.
- **Feat**: CV Score completeness indicator.
- **Feat**: One-click CV translation (English / Portuguese).
- **Feat**: Direct PDF export via jsPDF + html2canvas (multi-page).
- **Feat**: Page format selector (A4 / Letter) and margin controls.

### v1.0.0 — v1.2.0

- Initial release with core CV editing, IndexedDB storage, and multi-resume management.
- Drag & drop reordering, dark mode, undo/redo, and profile image upload.
- Smart date pickers and multi-language dictionary.

---

<div align="center">
  Built with care for professionals — <strong>Vitae v3.0</strong>
</div>
