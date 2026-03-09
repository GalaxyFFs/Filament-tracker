# Filament Tracker

Aplikace pro komplexní správu zásob filamentů a sledování historie 3D tisku.

Tato lokální webová aplikace ze silného technologického stacku (React, Vite, Tailwind v4) vám pomůže udržet si detailní přehled o vašich cívkách, spotřebě materiálu a celkových nákladech na jednotlivé tisky.

## ✨ Funkce

- 📊 **Dashboard:** Rychlý přehled o stavu zásob a nedávných tiskových úlohách.
- 🧵 **Inventář (Zásoby):** Správa všech tiskových strun, včetně specifikace značky, materiálu, barvy, zbývající hmotnosti, ceny cívky a váhy samotné prázdné cívky.
- ➕ **Přidání filamentu:** Snadné zalistování nových cívek do systému.
- 🖨️ **Záznam tisku (Log Print):** Logování odjetých tisků, které automaticky odečte spotřebovaný materiál z vybrané cívky a vypočítá celkovou cenu tisku zohledňující pořizovací cenu filamentu.
- 📜 **Historie:** Přehled všech historických tisků pro snadnou orientaci a zpětnou kontrolu.
- ⚙️ **Nastavení:** Přizpůsobení preferované měny, jednotek hmotnosti (g / kg), uživatelská správa výrobců, materiálů a možnost volby mezi moderním světlým a tmavým vzhledem.

## 🛠️ Technologie

- **[React 19](https://react.dev/)**
- **[TypeScript](https://www.typescriptlang.org/)** pro definici silně typovaných objektů.
- **[Vite](https://vitejs.dev/)** pro ultra rychlé vývojové prostředí.
- **[Tailwind CSS v4](https://tailwindcss.com/)** pro prémiový a plynule responzivní design.
- **[Framer Motion](https://motion.dev/)** zajišťující micro-interakce a plynulé přechody.
- **[Lucide React](https://lucide.dev/)** poskytující krásné vektorové ikony.
- Aplikace lokálně využívá **lokální ukládání** pro snadnou dostupnost dat přímo na vašem zařízení.

## 🚀 Instalace a spuštění

Aplikace je určena k lokálnímu nasazení. Pro správný chod je nutné mít nainstalované prostředí **Node.js**.

1. **Stažení a přechod do složky projektu:**
   Nejprve přejděte do složky aplikace v terminálu.
   ```bash
   cd my-filament
   ```

2. **Instalace závislostí:**
   ```bash
   npm install
   ```

3. **Spuštění vývojového serveru:**
   ```bash
   npm run dev
   ```

Server se spustí a aplikace bude dostupná v prohlížeči. Podle nactavení v `package.json` naslouchá na síťovém rozhraní, takže je často dostupná mj. na `http://localhost:3000/`.

## 🗄️ Struktura projektu

- `src/` - Hlavní adresář se zdrojovými kódy.
  - `components/` - Znovupoužitelné UI komponenty aplikace (jako např. hlavička a navigace - Sidebar).
  - `pages/` - Samotné stránky a pohledy (Dashboard, Inventory, Settings atd.).
  - `types.ts` - Sdílené TypeScript rozhraní (`Filament`, `PrintJob`, `Settings`).

---
*Vytvořeno pro komunitu 3D tisku s láskou k přehledné organizaci materiálu.*
