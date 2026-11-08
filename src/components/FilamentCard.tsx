import React from "react";
import { Trash2, AlertTriangle, Edit2, Calculator } from "lucide-react";
import { Filament } from "../types";
import { formatNumber, formatMoney } from "../utils/format";

interface FilamentCardProps {
  filament: Filament;
  onDelete: (id: string) => void;
  onDeplete: (id: string) => void;
  onEdit?: (id: string) => void;
  settings?: {
    weightUnit: "g" | "kg";
    currency: string;
  };
}

export default function FilamentCard({ filament, onDelete, onDeplete, onEdit, settings }: FilamentCardProps) {
  const percentage = Math.max(0, (filament.weightRemaining / filament.weightTotal) * 100);
  const isLow = percentage > 0 && percentage < 15;

  const weightDisplay = settings?.weightUnit === "kg"
    ? formatNumber(filament.weightRemaining / 1000)
    : formatNumber(filament.weightRemaining);
  const totalDisplay = settings?.weightUnit === "kg"
    ? formatNumber(filament.weightTotal / 1000) + "kg"
    : formatNumber(filament.weightTotal) + "g";

  const spoolCost = formatMoney(filament.price);
  const currency = settings?.currency || "USD";
  const currencySymbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : "Kč";

  return (
    <div className="relative bg-surface rounded-[24px] overflow-visible mt-4 mb-2 w-full">
      <div className="p-4 sm:p-6">
        {/* Header row: name + low stock + actions */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg sm:text-xl truncate pr-2">{filament.name}</h3>
          </div>
          {isLow && (
            <div className="flex items-center gap-1 text-amber-500 text-sm font-medium shrink-0">
              <AlertTriangle className="w-4 h-4" />
              Low stock
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            {onEdit && (
              <button
                onClick={onEdit}
                className="w-10 h-10 rounded-lg border border-surface-divider text-text-secondary hover:text-primary-green hover:bg-primary-green/10 hover:border-primary-green transition-colors flex items-center justify-center"
                aria-label="Edit filament"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => {
                if (window.confirm("Mark this spool as depleted (0g remaining)?")) {
                  onDeplete(filament.id);
                }
              }}
              className="w-10 h-10 rounded-lg border border-surface-divider text-text-secondary hover:text-action-blue hover:bg-action-blue/10 hover:border-action-blue transition-colors flex items-center justify-center"
              aria-label="Mark as depleted"
            >
              <span className="font-bold text-sm">0g</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm("Delete this filament? This cannot be undone.")) {
                  onDelete(filament.id);
                }
              }}
              className="w-10 h-10 rounded-lg border border-surface-divider text-text-secondary hover:text-danger-red hover:bg-danger-red/10 hover:border-danger-red transition-colors flex items-center justify-center"
              aria-label="Delete filament"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Color dot + meta info row */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="filament-color-dot flex-shrink-0"
            style={{ backgroundColor: filament.colorHex }}
          />
          <div className="flex-1 flex flex-wrap items-center gap-3 text-sm">
            <span className="font-medium text-text-primary">{filament.brand}</span>
            <span className="px-2 py-0.5 bg-bg rounded-lg">{filament.material}</span>
            <span className="text-text-secondary">{weightDisplay} / {totalDisplay}</span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <Calculator className="w-4 h-4" />
              Spool: {currencySymbol}{spoolCost}
            </span>
          </div>
        </div>

        {/* Full-width progress bar */}
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${percentage}%`,
              backgroundColor: filament.colorHex,
            }}
          />
        </div>
      </div>
    </div>
  );
}