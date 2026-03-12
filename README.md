<div align="center">
  <img src="public/vite.svg" alt="Logo" width="80" height="80" />
  <h1 align="center">🧵 Filament Tracker</h1>

  <p align="center">
    <strong>A modern, local-first web application for managing your 3D printing filament inventory and tracking print jobs.</strong>
    <br />
    <br />
    <a href="https://github.com/your_username/my-filament/issues">Report Bug</a>
    ·
    <a href="https://github.com/your_username/my-filament/issues">Request Feature</a>
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue.svg?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6-purple.svg?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC.svg?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green.svg?style=flat-square" alt="License" />
</div>

<br />

<!-- 
> [!TIP]
> **Screenshot Placeholder**
> Replace the image below with an actual screenshot of your application.

![App Screenshot](https://via.placeholder.com/1200x600.png?text=Application+Screenshot) 
-->

## 🌟 About The Project

Filament Tracker is an intuitive, fast, and completely local application designed for 3D printing enthusiasts. Keep a detailed overview of your spools, track material consumption, and automatically calculate the cost of each print based on your filament's purchase price.

With a beautiful, responsive interface powered by React 19, Tailwind CSS v4, and smooth Framer Motion animations, managing your inventory has never been easier.

### ✨ Key Features

- 📊 **Comprehensive Dashboard:** Get an instant overview of your stock levels, recent print jobs, and total material costs.
- 🧵 **Inventory Management:** Manage all your spools. Track brand, material, color, remaining weight, purchase price, and empty spool weight.
- ➕ **Add New Filament:** Quickly catalog new spools into your system with an intuitive interface.
- 🖨️ **Log Prints:** Record completed prints. The app automatically deducts the used material from the selected spool and calculates the exact cost of the print.
- 📜 **Print History:** Keep a detailed log of all historical prints for easy reference and cost analysis.
- ⚙️ **Customizable Settings:** Personalize your experience by setting your preferred currency, weight units (g/kg), managing custom brands and materials, and toggling between light and dark modes.
- 💾 **Local First:** All your data safely stays on your device utilizing local storage for privacy and speed.

## 🛠️ Built With

This project is built using a modern, powerful tech stack:

- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Static typing
- [Vite](https://vitejs.dev/) - Frontend tooling
- [Tailwind CSS v4](https://tailwindcss.com/) - Utility-first styling
- [Framer Motion](https://motion.dev/) - Animations
- [Lucide React](https://lucide.dev/) - Icons

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Ensure you have Node.js installed on your machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your_username/my-filament.git
   cd my-filament
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:3000/`.

## 🗄️ Project Structure

- `src/`
  - `components/` - Reusable UI components (Sidebar, Modals, Forms).
  - `pages/` - Main page views (Dashboard, Inventory, Settings, etc.).
  - `types.ts` - Shared TypeScript interfaces.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Created with ❤️ for the 3D printing community.*
