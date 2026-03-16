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
    <div className="w-full md:w-64 bg-bg-sidebar border-t md:border-t-0 md:border-r border-border flex flex-row md:flex-col shrink-0">
      <div className="hidden md:flex p-6 items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Box className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Filament Tracker</h1>
          <p className="text-xs text-gray-400">Local Inventory</p>
        </div>
      </div>

      <nav className="flex-1 px-2 py-2 md:px-4 md:py-4 flex flex-row md:flex-col justify-around md:justify-start gap-1 md:space-y-1 overflow-x-auto">
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
              className={`flex-1 md:flex-none md:w-full flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-2 py-2 md:px-4 md:py-3 rounded-xl transition-colors ${isActive
                ? "text-accent md:bg-accent/10"
                : "text-gray-400 hover:text-gray-200 md:hover:bg-bg-card"
                }`}
            >
              <Icon className="w-6 h-6 md:w-5 md:h-5" />
              <span className="text-[10px] md:text-sm font-medium">{item.label}</span>
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
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          <PlusSquare className="w-5 h-5" />
          Log Print Job
        </button>
      </div>
    </div>
  );
}
