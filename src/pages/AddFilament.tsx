import React, { useState, useMemo, useEffect } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { formatNumber } from "../utils/format";
import { useToast } from "../context/ToastContext";
import { ChevronDown, Plus, X } from "lucide-react";
import PrimaryButton from "../components/PrimaryButton";
import FormCard, { FormRow, FormDivider } from "../components/FormCard";
import ColorSwatchGrid from "../components/ColorSwatchGrid";
import NumberStepper from "../components/NumberStepper";

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

  const [type, setType] = useState("");
  const [colorHex, setColorHex] = useState("");
  const [name, setName] = useState("");
  const [fullSpoolWeight, setFullSpoolWeight] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [rolls, setRolls] = useState(1);
  const [manufacturer, setManufacturer] = useState("");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false);
  const [price, setPrice] = useState("");

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

  const handleAddManufacturer = () => {
    if (newManufacturer.trim() && !settings.manufacturers.includes(newManufacturer.trim())) {
      setManufacturer(newManufacturer.trim());
      setNewManufacturer("");
      setShowManufacturerDropdown(false);
    }
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
        setShowManufacturerDropdown(false);
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
        setShowManufacturerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync form state when editingFilamentId changes
  useEffect(() => {
    if (editingFilamentId) {
      const filament = filaments.find((f) => f.id === editingFilamentId);
      if (filament) {
        setType(filament.material);
        setColorHex(filament.colorHex.replace("#", ""));
        setName(filament.name);
        setFullSpoolWeight(filament.weightTotal.toString());
        setCurrentWeight(filament.weightRemaining.toString());
        setManufacturer(filament.brand);
        setPrice(filament.price.toString());
        setShowTypeDropdown(false);
        setShowManufacturerDropdown(false);
      }
    } else {
      // Reset to defaults when not editing
      setType("");
      setColorHex("#EE7739".replace("#", ""));
      setName(generateDefaultName());
      setFullSpoolWeight("1000");
      setCurrentWeight("");
      setManufacturer(settings.manufacturers[0] || "Generic");
      setPrice("");
      setShowTypeDropdown(false);
      setShowManufacturerDropdown(false);
    }
  }, [editingFilamentId, filaments]);

  return (
    <div className="max-w-2xl mx-auto pb-8 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            {editingFilament ? "Edit Filament" : "Add Filament"}
          </h1>
          <p className="text-text-secondary">
            {editingFilament ? "Update spool details" : "Add a new filament spool to your inventory"}
          </p>
        </div>
        <div className="flex gap-3">
          <PrimaryButton
            onClick={() => {
              setShowTypeDropdown(false);
              setShowManufacturerDropdown(false);
              setEditingFilamentId(null);
              onNavigate("inventory");
            }}
            fullWidth={false}
            className="bg-transparent border border-surface-divider text-text-primary hover:bg-surface"
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton onClick={handleSave} fullWidth={false}>
            {editingFilament ? "Save Changes" : "Save"}
          </PrimaryButton>
        </div>
      </div>

      {/* Form content */}
      <div className="space-y-6">
        {/* Card 1: Type and Color */}
        <FormCard>
          <div className="space-y-4">
            {/* Type - clickable dropdown */}
            <FormRow label="Type" required>
              <div className="flex justify-end">
                <div data-type-dropdown className="relative max-w-xs w-full">
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-right hover:border-primary-green transition-colors focus:outline-none focus:border-primary-green pr-10"
                    aria-expanded={showTypeDropdown}
                    aria-haspopup="listbox"
                  >
                    <span className={type ? "text-text-primary" : "text-text-secondary"}>
                      {type || "Select filament type"}
                    </span>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary transition-transform ${showTypeDropdown ? "rotate-180" : ""}`} />
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
              </div>
            </FormRow>

            <FormDivider />

            {/* Color */}
            <FormRow label="Color" required>
              <div className="flex justify-end">
                <ColorSwatchGrid
                  value={colorHex}
                  onChange={setColorHex}
                  className="max-h-[280px] overflow-y-auto max-w-xs w-full"
                />
              </div>
            </FormRow>
          </div>
        </FormCard>

        {/* Card 2: Spool details */}
        <FormCard>
          <div className="space-y-4">
            <FormRow label="Name" required>
              <div className="flex justify-end">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="max-w-xs bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                  placeholder="Name"
                />
              </div>
            </FormRow>

            <FormDivider />

            {/* Manufacturer - same dropdown pattern as Type */}
            <FormRow label="Manufacturer" required>
              <div className="flex justify-end">
                <div data-manufacturer-dropdown className="relative max-w-xs w-full">
                  <button
                    type="button"
                    onClick={() => setShowManufacturerDropdown(!showManufacturerDropdown)}
                    className="w-full bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-right hover:border-primary-green transition-colors focus:outline-none focus:border-primary-green pr-10"
                    aria-expanded={showManufacturerDropdown}
                    aria-haspopup="listbox"
                  >
                    <span className={manufacturer ? "text-text-primary" : "text-text-secondary"}>
                      {manufacturer || "Select manufacturer"}
                    </span>
                    <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary transition-transform ${showManufacturerDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {showManufacturerDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-surface-divider rounded-lg shadow-lg z-50 overflow-hidden animate-slide-in max-h-60 overflow-y-auto">
                      {settings.manufacturers.map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => { setManufacturer(m); setShowManufacturerDropdown(false); }}
                          className={`w-full px-3 py-2 text-sm font-medium text-left transition-colors ${manufacturer === m ? "bg-primary-green/15 text-primary-green" : "text-text-primary hover:bg-surface-divider"}`}
                          role="option"
                          aria-selected={manufacturer === m}
                        >
                          {m}
                        </button>
                      ))}
                      <div className="border-t border-surface-divider p-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newManufacturer}
                            onChange={(e) => setNewManufacturer(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddManufacturer();
                              if (e.key === "Escape") { setNewManufacturer(""); setShowManufacturerDropdown(false); }
                            }}
                            className="flex-1 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green"
                            placeholder="New manufacturer"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={handleAddManufacturer}
                            className="p-2 rounded-lg bg-primary-green text-white hover:bg-primary-green-hover transition-colors shrink-0"
                            disabled={!newManufacturer.trim()}
                            aria-label="Add manufacturer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FormRow>

            <FormDivider />

            <FormRow label="Full Spool Weight" required>
              <div className="flex justify-end">
                <div className="flex items-center gap-2 max-w-xs w-full justify-end">
                  <input
                    type="number"
                    value={fullSpoolWeight}
                    onChange={(e) => setFullSpoolWeight(e.target.value)}
                    className="w-24 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                    min="1"
                    max="10000"
                  />
                  <span className="text-text-secondary shrink-0">g</span>
                </div>
              </div>
            </FormRow>

            <FormDivider />

            <FormRow label="Current Weight" required>
              <div className="flex justify-end">
                <div className="flex items-center gap-2 max-w-xs w-full justify-end">
                  <input
                    type="number"
                    value={currentWeight}
                    onChange={(e) => setCurrentWeight(e.target.value)}
                    className="w-24 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                    min="0"
                    max="10000"
                    placeholder="0-10000"
                  />
                  <span className="text-text-secondary shrink-0">g</span>
                </div>
              </div>
            </FormRow>

            <FormDivider />

            <FormRow label="Rolls" required>
              <div className="flex justify-end">
                <div className="max-w-xs w-full">
                  <NumberStepper
                    value={rolls}
                    onChange={setRolls}
                    min={1}
                    max={99}
                  />
                </div>
              </div>
            </FormRow>

            <FormDivider />

            <FormRow label="Price (per spool)" required>
              <div className="flex justify-end">
                <div className="flex items-center gap-2 max-w-xs w-full justify-end">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-24 bg-bg border border-surface-divider rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary-green text-right"
                    placeholder="0.00"
                  />
                  <span className="text-text-secondary shrink-0">{settings.currency === "USD" ? "$" : settings.currency}</span>
                </div>
              </div>
            </FormRow>
          </div>
        </FormCard>
      </div>
    </div>
  );
}