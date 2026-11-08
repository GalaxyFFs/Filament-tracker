import React, { useState, useMemo } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";
import FilterChip from "../components/FilterChip";
import SectionHeader from "../components/SectionHeader";
import FilamentCard from "../components/FilamentCard";
import PrimaryButton from "../components/PrimaryButton";

interface InventoryProps {
  onNavigate: (page: Page) => void;
}

export default function Inventory({ onNavigate }: InventoryProps) {
  const { filaments, deleteFilament, updateFilament, settings, setEditingFilamentId } = useAppContext();
  const { showToast } = useToast();

  const [inPrinterFilter, setInPrinterFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Materials for filter
  const materials = useMemo(() => Array.from(new Set(filaments.map((f) => f.material))).sort(), [filaments]);

  // Filter filaments
  const filteredFilaments = useMemo(() => {
    return filaments.filter((f) => {
      if (inPrinterFilter && f.material !== inPrinterFilter) return false;
      if (typeFilter && f.material !== typeFilter) return false;
      if (statusFilter === "active" && f.weightRemaining <= 0) return false;
      if (statusFilter === "depleted" && f.weightRemaining > 0) return false;
      return true;
    });
  }, [filaments, inPrinterFilter, typeFilter, statusFilter]);

  // Group by material
  const groupedFilaments = useMemo(() => {
    const groups: Record<string, typeof filaments> = {};
    filteredFilaments.forEach((f) => {
      const material = f.material;
      if (!groups[material]) groups[material] = [];
      groups[material].push(f);
    });
    return groups;
  }, [filteredFilaments]);

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this filament? This cannot be undone.")) {
      deleteFilament(id);
      showToast("Filament deleted", "success");
    }
  };

  const handleEdit = (id: string) => {
    setEditingFilamentId(id);
    onNavigate("add-filament");
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Filament Library</h1>
          <p className="text-text-secondary">
            Manage your filament inventory
          </p>
        </div>
        <div className="flex gap-3">
          <PrimaryButton
            onClick={() => {
              setEditingFilamentId(null);
              onNavigate("add-filament");
            }}
            fullWidth={false}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Filament
          </PrimaryButton>
        </div>
      </div>

      {/* Filter row */}
      <div className="bg-surface border border-surface-divider rounded-[24px] p-4 mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-1 no-scrollbar w-full sm:w-auto">
            <FilterChip
              label="In Printer"
              options={materials}
              value={inPrinterFilter}
              onChange={setInPrinterFilter}
              placeholder="All"
            />
            <FilterChip
              label="Type"
              options={materials}
              value={typeFilter}
              onChange={setTypeFilter}
              placeholder="All"
            />
            <FilterChip
              label="Status"
              options={["active", "depleted"]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="All"
            />
          </div>
          <div className="text-sm text-text-secondary">
            {Object.keys(groupedFilaments).reduce((sum, k) => sum + groupedFilaments[k].length, 0)} of {filaments.length} filaments
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {Object.keys(groupedFilaments).length === 0 ? (
          <div className="bg-surface border border-surface-divider rounded-[24px] p-12 flex flex-col items-center justify-center text-text-secondary">
            <span className="text-lg mb-2">No filaments found</span>
            <p className="text-sm">Add your first spool to get started</p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedFilaments)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([material, items]) => (
                <div key={material} className="space-y-4">
                  <SectionHeader>{material}</SectionHeader>
                  <div className="space-y-3">
                    {items.map((filament) => (
                      <FilamentCard
                        key={filament.id}
                        filament={filament}
                        onDelete={handleDelete}
                        onDeplete={(id) => {
                          if (window.confirm("Mark this spool as depleted (0g remaining)?")) {
                            updateFilament(id, { weightRemaining: 0 });
                            showToast("Marked as depleted", "success");
                          }
                        }}
                        onEdit={handleEdit}
                        settings={{ weightUnit: settings.weightUnit, currency: settings.currency }}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}