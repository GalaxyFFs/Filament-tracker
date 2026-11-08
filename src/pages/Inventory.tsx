import React, { useState, useMemo } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { Plus } from "lucide-react";
import { useToast } from "../context/ToastContext";
import AppHeader from "../components/AppHeader";
import FilterChip from "../components/FilterChip";
import TextButton from "../components/TextButton";
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
  const [showEditMode, setShowEditMode] = useState(false);

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
    <div className="flex flex-col h-screen bg-bg">
      {/* Header bar */}
      <AppHeader title="Filament Library" onBack={() => onNavigate("dashboard")} />

      {/* Filter row */}
      <div className="bg-surface border-b border-surface-divider px-4 py-3">
        <div className="flex items-center gap-2 mb-2 overflow-x-auto whitespace-nowrap pb-1">
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
        <div className="flex justify-end">
          <TextButton
            onClick={() => setShowEditMode(!showEditMode)}
            variant={showEditMode ? "destructive" : "default"}
          >
            {showEditMode ? "Done" : "Edit"}
          </TextButton>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {Object.keys(groupedFilaments).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-secondary">
            <span className="text-lg mb-2">No filaments found</span>
            <p className="text-sm">Add your first spool to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedFilaments)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([material, items]) => (
                <div key={material} className="space-y-3">
                  <SectionHeader>{material}</SectionHeader>
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
                      settings={{ weightUnit: settings.weightUnit }}
                    />
                  ))}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Bottom bar - Add Filament button */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-surface-divider px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <PrimaryButton
          onClick={() => {
            setEditingFilamentId(null);
            onNavigate("add-filament");
          }}
          className="max-w-md mx-auto block"
        >
          <Plus className="w-5 h-5 mr-2 inline" />
          Add Filament
        </PrimaryButton>
      </div>
    </div>
  );
}