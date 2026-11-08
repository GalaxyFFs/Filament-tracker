import React, { useState, useMemo, useEffect, useRef } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { formatNumber } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ChevronLeft, ChevronRight, Minus, Plus, ChevronDown, ChevronUp, X } from "lucide-react";
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
  const [rolls, setRolls] = useState(1);
  const [note, setNote] = useState("");
  const [manufacturer, setManufacturer] = useState(editingFilament?.brand || (settings.manufacturers[0] || "Generic"));
  const [newManufacturer, setNewManufacturer] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showManufacturerInput, setShowManufacturerInput] = useState(false);
  const [price, setPrice] = useState(editingFilament?.price.toString() || "");

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
    if (!manufacturer.trim()) {
      showToast("Please enter a manufacturer", "error");
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
    const emptySpoolWeight = 200;
    const priceValue = Number(price) || 0;

    if (editingFilament) {
      updateFilament(editingFilament.id, {
        name: name.trim(),
        brand: manufacturer.trim(),
        material: type,
        colorHex: `#${colorHex.toUpperCase()}`,
        weightTotal,
        weightRemaining,
        emptySpoolWeight,
        price: priceValue,
      });
      setEditingFilamentId(null);
      showToast("Filament updated successfully", "success");
    } else {
      addFilament({
        name: name.trim(),
        brand: manufacturer.trim(),
        material: type,
        colorHex: `#${colorHex.toUpperCase()}`,
        weightTotal,
        weightRemaining,
        emptySpoolWeight,
        price: priceValue,
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
        setShowTypeDropdown(false);
        setShowManufacturerInput(false);
        setEditingFilamentId(null);
        onNavigate("inventory");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingFilamentId, onNavigate, showToast]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!e.target || !(e.target as HTMLElement).closest('[data-type-dropdown]')) {
        setShowTypeDropdown(false);
      }
      if (!e.target || !(e.target as HTMLElement).closest('[data-manufacturer-dropdown]')) {
        setShowManufacturerInput(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Header */}
      <AppHeader
        title={editingFilament ? "Edit Filament" : "Add Filament"}
        onBack={() => {
          setShowTypeDropdown(false);
          setShowManufacturerInput(false);
          setEditingFilamentId(null);
          onNavigate("inventory");
        }}
      />

      {/* Form content - single scroll area, no nested scrolling */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-md mx-auto space-y-4">
          {/* Card 1: Type and Color */}
          <FormCard>
            <div className="space-y-4">
              {/* Type - clickable dropdown */}
              <FormRow label="Type" required>
                <div data-type-dropdown className="relative w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-bg border border-surface-divider rounded-lg text-left hover:border-primary-green transition-colors focus:outline-none focus:border-primary-green"
                    aria-expanded={showTypeDropdown}
                    aria-haspopup="listbox"
                  >
                    <span className={type ? "text-text-primary" : "text-text-secondary"}>
                      {type || "Select filament type"}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-text-secondary transition-transform ${showTypeDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showTypeDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-surface-divider rounded-lg shadow-lg z-50 overflow-hidden animate-slide-in max-h-60 overflow-y-auto">
                      {FILAMENT_TYPES.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setType(t); setShowTypeDropdown(false); }}
                          className={`w-full px-3 py-2 text-sm font-medium text-left transition-colors ${type === t ? "bg-primary-green/15 text-primary-green" : "text-text-primary hover:bg-surface-divider"}`}
                          role="option"
                          aria-selected={type === t}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </FormRow>

              <FormDivider />

              {/* Color */}
              <FormRow label="Color" required>
                <ColorSwatchGrid
                  value={colorHex}
                  onChange={setColorHex}
                  className="max-h-[280px] overflow-y-auto"
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

              {/* Manufacturer */}
              <FormRow label="Manufacturer" required>
                <div data-manufacturer-dropdown className="relative w-full max-w-xs">
                  {showManufacturerInput ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newManufacturer}
                        onChange={(e) => setNewManufacturer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newManufacturer.trim()) {
                            setManufacturer(newManufacturer.trim());
                            setNewManufacturer("");
                            setShowManufacturerInput(false);
                          }
                          if (e.key === "Escape") {
                            setNewManufacturer("");
                            setShowManufacturerInput(false);
                          }
                        }}
                        className="flex-1 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green"
                        placeholder="New manufacturer"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => { setManufacturer(newManufacturer.trim()); setNewManufacturer(""); setShowManufacturerInput(false); }}
                        className="p-2 rounded-lg bg-primary-green text-white hover:bg-primary-green-hover transition-colors"
                        disabled={!newManufacturer.trim()}
                        aria-label="Add manufacturer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <select
                        value={manufacturer}
                        onChange={(e) => setManufacturer(e.target.value)}
                        className="flex-1 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green appearance-none bg-no-repeat bg-right-[10px] bg-center pr-8"
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%238A8A8A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                        }}
                      >
                        {settings.manufacturers.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowManufacturerInput(true)}
                        className="p-2 rounded-lg border border-surface-divider text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
                        aria-label="Add new manufacturer"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
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

              <FormDivider />

              <FormRow label="Price (per spool)">
                <div className="flex items-center gap-2 w-full max-w-xs justify-end">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-24 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                    placeholder="0.00"
                  />
                  <span className="text-text-secondary">{settings.currency === "USD" ? "$" : settings.currency}</span>
                </div>
              </FormRow>
            </FormCard>
          </CollapsibleSection>
        </div>
      </div>

      {/* Bottom bar - Save button */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg border-t border-surface-divider p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] flex justify-center">
        <PrimaryButton onClick={handleSave} fullWidth={false}>
          {editingFilament ? "Save Changes" : "Save"}
        </PrimaryButton>
      </div>
    </div>
  );
}