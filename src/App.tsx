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
    <div className="flex flex-col-reverse md:flex-row h-screen bg-bg-main text-gray-100 font-sans">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto p-4 pb-24 md:p-8 md:pb-8">{renderPage()}</main>
    </div>
  );
}
