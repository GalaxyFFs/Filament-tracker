import React from "react";
import { Archive, AlertTriangle, Scale, Plus, History } from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { formatNumber } from "../utils/format";

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
      ? formatNumber(totalWeight / 1000)
      : formatNumber(totalWeight);


  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">My Stock</h1>
          <p className="text-text-secondary">
            Local overview of materials and weights
          </p>
        </div>
        <div className="flex gap-3">
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-accent/30 transition-colors shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary text-sm font-medium">Total Spools</p>
            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center">
              <Archive className="w-5 h-5 text-accent" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 tracking-tight">{totalSpools}</h2>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-amber-500/30 transition-colors shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary text-sm font-medium">Low Stock Alerts</p>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 tracking-tight">{lowStockCount}</h2>
          {lowStockCount > 0 && (
            <p className="text-amber-500 text-sm font-medium">Restock needed</p>
          )}
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 relative overflow-hidden group hover:border-accent/30 transition-colors shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="flex justify-between items-start mb-4">
            <p className="text-text-secondary text-sm font-medium">Total Net Weight</p>
            <div className="w-10 h-10 rounded-lg bg-accent-soft flex items-center justify-center">
              <Scale className="w-5 h-5 text-accent" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-2 tracking-tight">
            {displayWeight}{" "}
            <span className="text-xl text-text-secondary font-normal">
              {settings.weightUnit}
            </span>
          </h2>
          <p className="text-text-secondary text-sm flex items-center gap-1">
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
          className="bg-transparent border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-text-secondary hover:text-accent hover:border-accent transition-colors min-h-[280px]"
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
  const circumference = 2 * Math.PI * 38;

  return (
    <div
      className={`bg-bg-card border rounded-2xl p-5 relative transition-all duration-200 hover:border-accent/40 ${isLow ? "border-amber-500/50" : "border-border"}`}
    >
      {isLow && (
        <div className="absolute top-4 left-4 bg-amber-500/20 text-amber-500 text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> LOW
        </div>
      )}
      <div className="absolute top-4 right-4 bg-bg-card border border-border text-text-primary text-xs font-bold px-2.5 py-1 rounded-md">
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
              r="38"
              fill="transparent"
              stroke="var(--theme-border)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="transparent"
              stroke={filament.colorHex}
              strokeWidth="6"
              strokeDasharray={`${(percentage * circumference) / 100} ${circumference}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-bg-card flex items-center justify-center border border-border/50">
              <span
                className="text-sm font-bold"
                style={{ color: filament.colorHex }}
              >
                {Math.round(percentage)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-bold text-lg truncate">{filament.name}</h3>
          <div
            className="w-3.5 h-3.5 rounded-full ring-2 ring-white/20 shrink-0"
            style={{ backgroundColor: filament.colorHex }}
          ></div>
        </div>
        <p className="text-text-secondary text-sm mb-4">{filament.brand}</p>

        <div className="flex justify-between text-xs text-text-secondary mb-2">
          <span>Remaining</span>
          <span className="text-text-primary font-medium">
            {formatNumber(filament.weightRemaining)}g /{" "}
            {filament.weightTotal >= 1000
              ? formatNumber(filament.weightTotal / 1000) + "kg"
              : formatNumber(filament.weightTotal) + "g"}
          </span>
        </div>
        <div className="w-full bg-bg-main rounded-full h-1.5 overflow-hidden">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
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
