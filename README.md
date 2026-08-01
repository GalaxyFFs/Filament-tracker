<div align="center">
  <img src="public/favicon.svg" alt="Logo" width="80" height="80" />
  <h1 align="center">🧵 Filament Tracker</h1>

  <p align="center">
    <strong>A modern, local-first PWA for managing 3D printing filament inventory and tracking print jobs.</strong>
    <br />
    <br />
    <a href="https://github.com/GalaxyFFs/Filament-tracker/issues">Report Bug</a>
    ·
    <a href="https://github.com/GalaxyFFs/Filament-tracker/issues">Request Feature</a>
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue.svg?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-purple.svg?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/PWA-Ready-orange.svg?style=flat-square" alt="PWA Ready" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />
</div>

<br />

## 🌟 About The Project

**Filament Tracker** is an intuitive, fast, and completely local web application designed for 3D printing enthusiasts. Keep a detailed overview of your spools, track material consumption, and automatically calculate the cost of each print based on your filament's purchase price.

With a beautiful, responsive interface powered by React 19, Tailwind CSS v4, and modern dark/light themes, managing your inventory has never been easier.

### ✨ Key Features

- 📊 **Comprehensive Dashboard:** Instant overview of your stock levels, low-stock warnings, and total net material weight.
- 🧵 **Inventory Management:** Track brand, material, color, remaining weight, total weight, price, and empty spool weight for every spool.
- 🖨️ **Log Prints & Cost Calculation:** Record completed prints with estimated waste/supports. The app automatically calculates exact cost and deducts material.
- 🔄 **Automatic & Retrospective Sync:** Modifying or deleting print jobs automatically recalculates and synchronizes spool weights across your entire history.
- 📜 **Print History:** Keep a detailed log of all historical prints with model names, dates, filaments used, weight consumed, and total cost.
- ⚙️ **Customizable Preferences:** Configure currency (`USD`, `EUR`, `CZK`), weight units (`g` / `kg`), theme mode (`dark` / `light`), primary accent color, and custom manufacturer/material lists.
-📱 **PWA & Offline First:** Install as a Progressive Web App on desktop or mobile for offline access.
- 💾 **Local First & Backup:** All data stays privately on your device. Easily export and restore full JSON backups anytime.

## 🛠️ Built With

- [React 19](https://react.dev/) - UI Library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vitejs.dev/) - Build tool & dev server
- [Tailwind CSS v4](https://tailwindcss.com/) - Modern utility-first styling
- [Lucide React](https://lucide.dev/) - Icons
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/) - Offline & PWA capabilities

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18+) installed on your system.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GalaxyFFs/Filament-tracker.git
   cd Filament-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🗄️ Project Structure

```text
src/
├── components/      # Reusable UI components (Sidebar, ColorPicker)
├── context/         # Central AppContext (State management & auto-sync logic)
├── pages/           # Main page views (Dashboard, Inventory, LogPrint, History, AddFilament, Settings)
├── utils/           # Helper utilities (format.ts for number & currency formatting)
├── types.ts         # TypeScript interfaces (Filament, PrintJob, Settings)
├── App.tsx          # Main routing & layout structure
└── main.tsx         # Application entrypoint & PWA registration
```

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository, make improvements, and open a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ for the 3D printing community.*
