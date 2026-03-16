import React from "react";
import { Archive, AlertTriangle, Scale, Plus, History } from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { filaments, settings, setEditingFilamentId } = useAppContext();

  const activeFilaments = filaments.filter((f) => f.weightRemaining > 0);

  const totalSpools = activeFilaments.length;
  const lowStockCount = activeFilaments.filter(
    (f) => f.weightRemaining / f.weightTotal < 0.15,
  ).length;
  const totalWeight = activeFilaments.reduce((sum, f) => sum + f.weightRemaining, 0);

  const displayWeight =
    settings.weightUnit === "kg"
      ? (totalWeight / 1000).toFixed(2)
      : totalWeight.toString();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">My Stock</h1>
          <p className="text-gray-400">
            Local overview of materials and weights
          </p>
        </div>
        <div className="flex gap-3">
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm">Total Spools</p>
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Archive className="w-5 h-5 text-accent" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">{totalSpools}</h2>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm">Low Stock Alerts</p>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">{lowStockCount}</h2>
          {lowStockCount > 0 && (
            <p className="text-amber-500 text-sm">Restock needed</p>
          )}
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <p className="text-gray-400 text-sm">Total Net Weight</p>
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
              <Scale className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2">
            {displayWeight}{" "}
            <span className="text-xl text-gray-500 font-normal">
              {settings.weightUnit}
            </span>
          </h2>
          <p className="text-gray-500 text-sm flex items-center gap-1">
            <History className="w-3 h-3" /> Last updated today
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Filament Spools</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {activeFilaments.slice(0, 7).map((filament) => (
          <FilamentCard key={filament.id} filament={filament} />
        ))}

        <button
          onClick={() => {
            setEditingFilamentId(null);
            onNavigate("add-filament");
          }}
          className="bg-transparent border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-colors min-h-[280px]"
        >
          <div className="w-12 h-12 rounded-full bg-bg-card flex items-center justify-center mb-4">
            <Plus className="w-6 h-6" />
          </div>
          <span className="font-medium">Add New Spool</span>
        </button>
      </div>
    </div>
  );
}

function FilamentCard({ filament }: { filament: any; key?: string | number }) {
  const percentage = Math.max(0, (filament.weightRemaining / filament.weightTotal) * 100);
  const isLow = percentage > 0 && percentage < 15;

  return (
    <div
      className={`bg-bg-card border rounded-2xl p-5 relative ${isLow ? "border-amber-500/50" : "border-border"}`}
    >
      {isLow && (
        <div className="absolute top-4 left-4 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> LOW
        </div>
      )}
      <div className="absolute top-4 right-4 bg-gray-800 text-gray-300 text-xs font-bold px-2 py-1 rounded">
        {filament.material}
      </div>

      <div className="flex justify-center my-6">
        <div className="relative w-24 h-24">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#2a2f3a"
              strokeWidth="12"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="13"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke={filament.colorHex}
              strokeWidth="12"
              strokeDasharray={`${percentage * 2.51} 251`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-bg-main shadow-inner"></div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg truncate">{filament.name}</h3>
          <div
            className="w-3 h-3 rounded-full ring-1 ring-white/20"
            style={{ backgroundColor: filament.colorHex }}
          ></div>
        </div>
        <p className="text-gray-400 text-sm mb-4">{filament.brand}</p>

        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Remaining</span>
          <span className="text-gray-200 font-medium">
            {filament.weightRemaining}g /{" "}
            {filament.weightTotal >= 1000
              ? filament.weightTotal / 1000 + "kg"
              : filament.weightTotal + "g"}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 ring-1 ring-white/5">
          <div
            className="h-1.5 rounded-full ring-1 ring-white/15"
            style={{
              width: `${percentage}%`,
              backgroundColor: filament.colorHex,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
