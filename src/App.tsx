import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddFilament from "./pages/AddFilament";
import History from "./pages/History";
import LogPrint from "./pages/LogPrint";
import Settings from "./pages/Settings";

export type Page =
  | "dashboard"
  | "inventory"
  | "add-filament"
  | "history"
  | "log-print"
  | "settings";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard onNavigate={setCurrentPage} />;
      case "inventory":
        return <Inventory onNavigate={setCurrentPage} />;
      case "add-filament":
        return <AddFilament onNavigate={setCurrentPage} />;
      case "history":
        return <History onNavigate={setCurrentPage} />;
      case "log-print":
        return <LogPrint onNavigate={setCurrentPage} />;
      case "settings":
        return <Settings onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen bg-bg text-text-primary font-sans overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <div className="flex-1 p-4 pt-[calc(0.75rem+env(safe-area-inset-top))] md:p-8 md:pt-8 md:pb-8">
          {renderPage()}
        </div>

        <div className="hidden md:flex h-10 shrink-0 items-center justify-between px-6 border-t border-surface-divider bg-surface">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-green" />
            <span className="text-xs font-medium text-text-secondary">
              Filament Tracker
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-text-secondary">GalaxyFFs</span>
            <span className="text-xs text-text-secondary">© 2026</span>
          </div>
        </div>
      </main>
    </div>
  );
}