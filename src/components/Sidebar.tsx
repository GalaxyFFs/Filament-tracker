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

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-bg-sidebar border-r border-border flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <Box className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Filament Tracker</h1>
          <p className="text-xs text-gray-400">Local Inventory</p>
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
              onClick={() => onNavigate(item.id as Page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                ? "bg-accent/10 text-accent"
                : "text-gray-400 hover:bg-bg-card hover:text-gray-200"
                }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <button
          onClick={() => onNavigate("log-print")}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          <PlusSquare className="w-5 h-5" />
          Log Print Job
        </button>
      </div>
    </div>
  );
}
