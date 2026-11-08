<div align="center">
  <img src="public/favicon.svg" alt="Filament Tracker logo" width="96" height="96" />
  <h1 align="center">Filament Tracker</h1>
  <p align="center">
    A local-first PWA for managing 3D printing filament inventory and tracking print jobs.
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue.svg?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-7-blue.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-8-purple.svg?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-Ready-orange.svg?style=flat-square" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />
</div>

<br />

## Overview

Filament Tracker is a fast, local-first Progressive Web App for 3D printing enthusiasts. Keep a detailed overview of your spools, track material consumption, and automatically calculate the cost of each print based on your filament's purchase price.

With a responsive, mobile-first interface powered by React 19, Tailwind CSS v4, and a single dark theme, managing your inventory has never been easier.

## Features

- **Dashboard** — Instant overview of your stock levels, low-stock warnings, and total net material weight.
- **Inventory Management** — Track brand, material, color, remaining weight, total weight, price, and empty spool weight for every spool.
- **Log Prints & Cost Calculation** — Record completed prints with estimated waste/supports. The app automatically calculates exact cost and deducts material.
- **Automatic & Retrospective Sync** — Modifying or deleting print jobs automatically recalculates and synchronizes spool weights across your entire history.
- **Print History** — A detailed log of all historical prints with model names, dates, filaments used, weight consumed, and total cost.
- **Customizable Preferences** — Configure currency (`USD`, `EUR`, `CZK`), weight units (`g` / `kg`), date format, accent color, and custom manufacturer/material lists.
- **PWA & Offline First** — Install as a Progressive Web App on desktop or mobile for offline access.
- **Local First & Backup** — All data stays privately on your device. Export and restore full JSON backups anytime.
- **Keyboard Shortcuts** — `Cmd/Ctrl+S` to save forms, `Escape` to cancel.
- **Toast Notifications** — Non-blocking success/error feedback for all actions.
- **Security** — Content Security Policy (CSP), input sanitization, validated backups, and protection against XSS.

## Tech Stack

- [React 19](https://react.dev/) — UI Library
- [TypeScript 7](https://www.typescriptlang.org/) — Type safety (strict mode)
- [Vite 8](https://vitejs.dev/) — Build tool & dev server
- [Tailwind CSS v4](https://tailwindcss.com/) — Utility-first styling
- [Lucide React](https://lucide.dev/) — Icons
- [Vite PWA Plugin v2](https://vite-pwa-org.netlify.app/) — Offline & PWA capabilities

## Getting Started

### Prerequisites

Ensure you have Node.js (v18+) installed on your system.

### Installation

```bash
git clone https://github.com/GalaxyFFs/Filament-tracker.git
cd Filament-tracker
npm install
```

### Development

```bash
npm run dev        # Dev server on port 3000
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # TypeScript type-check
npm run clean      # Remove the dist folder
```

## Project Structure

```text
src/
├── components/      # Reusable UI components (Sidebar, FilamentCard, PrimaryButton, …)
├── context/         # Central AppContext (state management & auto-sync) + Toast notifications
├── pages/           # Main page views (Dashboard, Inventory, LogPrint, History, AddFilament, Settings)
├── utils/           # Helper utilities (format.ts, validation.ts)
├── types.ts         # TypeScript interfaces (Filament, PrintJob, Settings)
├── App.tsx          # Main routing & layout structure
└── main.tsx         # Application entrypoint & PWA registration
```

## Contributing

Contributions are welcome! Feel free to fork the repository, make improvements, and open a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Licensing

Distributed under the MIT License. See `LICENSE` for more information.

- **Fonts**: Inter (SIL OFL 1.1) — see `licenses/Inter-OFL.txt`
- **Icons**: Lucide (ISC) — see `THIRD_PARTY_LICENSES.md`

Full dependency license audit: `LICENSE_AUDIT.md`

---

Created for the 3D printing community.