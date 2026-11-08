import React from "react";
import {
  LayoutDashboard,
  Package,
  History,
  Settings,
  PlusSquare,
  Box,
} from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { setEditingFilamentId, setEditingPrintJobId } = useAppContext();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleNavigate = (item: Page) => {
    setEditingFilamentId(null);
    setEditingPrintJobId(null);
    onNavigate(item);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:shrink-0 md:bg-surface md:border-r md:border-surface-divider">
        <div className="p-6 items-center gap-3 flex">
          <div className="w-8 h-8 rounded-lg bg-[#4FB536] flex items-center justify-center shadow-[0_0_12px_rgba(79,181,54,0.3)]">
            <Box className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">Filament Tracker</h1>
            <p className="text-xs text-text-secondary">Local Inventory</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentPage === item.id ||
              (currentPage === "add-filament" && item.id === "inventory");
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id as Page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                  ? "bg-primary-green text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-divider"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4">
          <button
            onClick={() => handleNavigate("log-print")}
            className="w-full flex items-center justify-center gap-2 bg-primary-green hover:bg-primary-green-hover text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-[0_0_14px_rgba(79,181,54,0.3)]"
          >
            <PlusSquare className="w-5 h-5" />
            Log Print Job
          </button>
        </div>
      </div>

      {/* Mobile bottom navbar — stationary at the bottom of the screen */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-end justify-between gap-1 px-2 pb-[env(safe-area-inset-bottom)] pt-2 bg-surface/95 backdrop-blur border-t border-surface-divider">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (currentPage === "add-filament" && item.id === "inventory");
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id as Page)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors ${isActive
                ? "text-primary-green"
                : "text-text-secondary hover:text-text-primary"
                }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => handleNavigate("log-print")}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors text-white bg-primary-green"
        >
          <PlusSquare className="w-6 h-6" />
          <span className="text-[10px] font-medium">Log Print</span>
        </button>
      </div>
    </>
  );
}