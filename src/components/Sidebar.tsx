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

  return (
    <div
      className="w-full md:w-64 bg-surface border-t md:border-t-0 md:border-r border-surface-divider flex flex-col shrink-0"
    >
      <div className="hidden md:flex p-6 items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#4FB536] flex items-center justify-center shadow-[0_0_12px_rgba(79,181,54,0.3)]">
          <Box className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Filament Tracker</h1>
          <p className="text-xs text-text-secondary">Local Inventory</p>
        </div>
      </div>

      <nav className="hidden md:flex md:flex-1 md:px-4 md:py-4 md:space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.id ||
            (currentPage === "add-filament" && item.id === "inventory");
          return (
            <button
              key={item.id}
              onClick={() => {
                setEditingFilamentId(null);
                setEditingPrintJobId(null);
                onNavigate(item.id as Page);
              }}
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

      <div className="hidden md:block p-4">
        <button
          onClick={() => {
            setEditingPrintJobId(null);
            onNavigate("log-print");
          }}
          className="w-full flex items-center justify-center gap-2 bg-primary-green hover:bg-primary-green-hover text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors shadow-[0_0_14px_rgba(79,181,54,0.3)]"
        >
          <PlusSquare className="w-5 h-5" />
          Log Print Job
        </button>
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
              onClick={() => {
                setEditingFilamentId(null);
                setEditingPrintJobId(null);
                onNavigate(item.id as Page);
              }}
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
          onClick={() => {
            setEditingPrintJobId(null);
            onNavigate("log-print");
          }}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors text-white bg-primary-green"
        >
          <PlusSquare className="w-6 h-6" />
          <span className="text-[10px] font-medium">Log Print</span>
        </button>
      </div>
    </div>
  );
}