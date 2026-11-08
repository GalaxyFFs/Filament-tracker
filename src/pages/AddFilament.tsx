import React, { useState, useMemo, useEffect, useRef } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { formatNumber } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ChevronLeft, ChevronRight, Minus, Plus, ChevronDown, ChevronUp } from "lucide-react";
import AppHeader from "../components/AppHeader";
import PrimaryButton from "../components/PrimaryButton";
import FormCard, { FormRow, FormDivider } from "../components/FormCard";
import ColorSwatchGrid from "../components/ColorSwatchGrid";
import NumberStepper from "../components/NumberStepper";
import CollapsibleSection from "../components/CollapsibleSection";

const FILAMENT_TYPES = [
  "PLA", "PLA+", "PETG", "ABS", "ASA", "TPU", "Nylon", "PC", "HIPS", "PVA", "Wood-fill", "Carbon-fiber"
];

const generateDefaultName = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${month}/${day}/${year} ${hours}:${minutes} added`;
};

interface AddFilamentProps {
  onNavigate: (page: Page) => void;
}

export default function AddFilament({ onNavigate }: AddFilamentProps) {
  const { addFilament, updateFilament, settings, filaments, editingFilamentId, setEditingFilamentId } = useAppContext();
  const { showToast } = useToast();

  const editingFilament = useMemo(
    () => editingFilamentId ? filaments.find((f) => f.id === editingFilamentId) : null,
    [filaments, editingFilamentId]
  );

  const [type, setType] = useState(editingFilament?.material || "");
  const [colorHex, setColorHex] = useState((editingFilament?.colorHex || "#EE7739").replace("#", ""));
  const [name, setName] = useState(editingFilament?.name || generateDefaultName());
  const [fullSpoolWeight, setFullSpoolWeight] = useState(editingFilament?.weightTotal.toString() || "1000");
  const [currentWeight, setCurrentWeight] = useState(editingFilament?.weightRemaining.toString() || "");
  const [rolls, setRolls] = useState((editingFilament?.emptySpoolWeight ?? 0) > 0 ? 1 : 1); // Default to 1
  const [note, setNote] = useState(editingFilament?.price.toString() || ""); // Reusing price field for note

  const handleSave = () => {
    if (!type) {
      showToast("Please select a filament type", "error");
      return;
    }
    if (!colorHex) {
      showToast("Please select a color", "error");
      return;
    }
    if (!name.trim()) {
      showToast("Please enter a name", "error");
      return;
    }
    const fullWeight = Number(fullSpoolWeight);
    const currentW = Number(currentWeight);
    if (isNaN(fullWeight) || fullWeight <= 0 || fullWeight > 10000) {
      showToast("Full spool weight must be between 1 and 10000g", "error");
      return;
    }
    if (isNaN(currentW) || currentW < 0 || currentW > 10000) {
      showToast("Current weight must be between 0 and 10000g", "error");
      return;
    }
    if (currentW > fullWeight) {
      showToast("Current weight cannot exceed full spool weight", "error");
      return;
    }
    if (rolls < 1) {
      showToast("Rolls must be at least 1", "error");
      return;
    }

    const weightTotal = Number(fullSpoolWeight);
    const weightRemaining = Number(currentWeight) || weightTotal;
    const emptySpoolWeight = 200; // Default empty spool weight
    const price = 0; // Price not in new form

    if (editingFilament) {
      updateFilament(editingFilament.id, {
        name: name.trim(),
        material: type,
        colorHex: `#${colorHex.toUpperCase()}`,
        weightTotal,
        weightRemaining,
        emptySpoolWeight,
        price,
      });
      setEditingFilamentId(null);
      showToast("Filament updated successfully", "success");
    } else {
      addFilament({
        name: name.trim(),
        brand: settings.manufacturers[0] || "Generic",
        material: type,
        colorHex: `#${colorHex.toUpperCase()}`,
        weightTotal,
        weightRemaining,
        emptySpoolWeight,
        price,
      });
      showToast("Filament added successfully", "success");
    }

    onNavigate("inventory");
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
      if (e.key === "Escape") {
        setEditingFilamentId(null);
        onNavigate("inventory");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingFilamentId, onNavigate, showToast]);

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Header */}
      <AppHeader
        title="Add Filament"
        onBack={() => {
          setEditingFilamentId(null);
          onNavigate("inventory");
        }}
      />

      {/* Form content */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {/* Card 1: Type and Color */}
          <FormCard>
            <div className="space-y-4">
              {/* Type */}
              <FormRow label="Type" required>
                <div className="flex items-center justify-between w-full max-w-xs">
                  <span className={type ? "text-text-primary" : "text-text-secondary"}>
                    {type || "Please Select"}
                  </span>
                  <ChevronRight className="w-5 h-5 text-text-secondary" />
                </div>
              </FormRow>

              {/* Type picker dropdown */}
              {type === "" && (
                <div className="bg-bg border border-surface-divider rounded-xl p-4 animate-slide-in">
                  <div className="grid grid-cols-3 gap-2">
                    {FILAMENT_TYPES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className="py-2 px-3 text-sm font-medium text-text-primary bg-surface border border-surface-divider rounded-lg hover:bg-surface-divider transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <FormDivider />

              {/* Color */}
              <FormRow label="Color" required>
                <ColorSwatchGrid
                  value={colorHex}
                  onChange={setColorHex}
                />
              </FormRow>
            </div>
          </FormCard>

          {/* Card 2: Spool details */}
          <FormCard>
            <div className="space-y-4">
              <FormRow label="Name" required>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full max-w-xs bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                  placeholder="Name"
                />
              </FormRow>

              <FormDivider />

              <FormRow label="Full Spool Weight" required>
                <div className="flex items-center gap-2 w-full max-w-xs justify-end">
                  <input
                    type="number"
                    value={fullSpoolWeight}
                    onChange={(e) => setFullSpoolWeight(e.target.value)}
                    className="w-24 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                    min="1"
                    max="10000"
                  />
                  <span className="text-text-secondary">g</span>
                </div>
              </FormRow>

              <FormDivider />

              <FormRow label="Current Weight" required>
                <div className="flex items-center gap-2 w-full max-w-xs justify-end">
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="w-24 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                    min="0"
                    max="10000"
                    placeholder="0-10000"
                  />
                  <span className="text-text-secondary">g</span>
                </div>
              </FormRow>

              <FormDivider />

              <FormRow label="Rolls" required>
                <NumberStepper
                  value={rolls}
                  onChange={setRolls}
                  min={1}
                  max={99}
                />
              </FormRow>
            </div>
          </FormCard>

          {/* Advanced Options */}
          <CollapsibleSection title="Advanced Options" defaultOpen={false}>
            <FormCard className="p-4">
              <FormRow label="Note">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green resize-none"
                  rows={3}
                  placeholder="Please enter your note"
                />
              </FormRow>
            </FormCard>
          </CollapsibleSection>
        </div>
      </div>

      {/* Bottom bar - Save button */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-surface-divider p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <PrimaryButton onClick={handleSave}>
          Save
        </PrimaryButton>
      </div>
    </div>
  );
}