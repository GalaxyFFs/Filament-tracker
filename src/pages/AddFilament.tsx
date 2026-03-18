import React, { useState, useMemo } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import ColorPicker from "../components/ColorPicker";

interface AddFilamentProps {
  onNavigate: (page: Page) => void;
}

export default function AddFilament({ onNavigate }: AddFilamentProps) {
  const { addFilament, updateFilament, settings, filaments, editingFilamentId, setEditingFilamentId } = useAppContext();

  const editingFilament = useMemo(
    () => editingFilamentId ? filaments.find((f) => f.id === editingFilamentId) : null,
    [filaments, editingFilamentId]
  );

  const [name, setName] = useState(editingFilament?.name || "");
  const [brand, setBrand] = useState(editingFilament?.brand || settings.manufacturers[0] || "");
  const [material, setMaterial] = useState(editingFilament?.material || settings.materials[0] || "");
  const [colorHex, setColorHex] = useState(editingFilament?.colorHex?.replace("#", "") || "8B5CF6");
  const [weightTotal, setWeightTotal] = useState(editingFilament?.weightTotal.toString() || "1000");
  const [emptySpoolWeight, setEmptySpoolWeight] = useState(editingFilament?.emptySpoolWeight.toString() || "200");
  const [price, setPrice] = useState(editingFilament?.price.toString() || "");

  const handleSave = () => {
    if (
      !name ||
      !brand ||
      !material ||
      !colorHex ||
      !weightTotal ||
      !emptySpoolWeight ||
      !price
    ) {
      alert("Please fill in all fields");
      return;
    }

    if (editingFilament) {
      const diff = Number(weightTotal) - editingFilament.weightTotal;
      updateFilament(editingFilament.id, {
        name,
        brand,
        material,
        colorHex: `#${colorHex.replace("#", "")}`,
        weightTotal: Number(weightTotal),
        weightRemaining: Math.max(0, editingFilament.weightRemaining + diff),
        emptySpoolWeight: Number(emptySpoolWeight),
        price: Number(price),
      });
      setEditingFilamentId(null);
    } else {
      addFilament({
        name,
        brand,
        material,
        colorHex: `#${colorHex.replace("#", "")}`,
        weightTotal: Number(weightTotal),
        weightRemaining: Number(weightTotal),
        emptySpoolWeight: Number(emptySpoolWeight),
        price: Number(price),
      });
    }

    onNavigate("inventory");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-sm text-text-secondary flex items-center gap-2">
        <button
          onClick={() => onNavigate("inventory")}
          className="hover:text-text-primary"
        >
          Inventory
        </button>
        <span>/</span>
        <span className="text-text-primary">Add Filament</span>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {editingFilament ? "Edit Filament" : "Add New Filament"}
        </h1>
        <p className="text-text-secondary">
          Enter the details of your filament spool to track it in your local
          inventory.
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Filament Name
              </label>
              <input
                type="text"
                placeholder="e.g. Matte Navy Blue"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary appearance-none"
              >
                <option value="" disabled>
                  Select from your brands...
                </option>
                {settings.manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Material Type
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary appearance-none"
              >
                <option value="" disabled>
                  Select from your materials...
                </option>
                {settings.materials.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Color
              </label>
              <div className="flex gap-3">
                <ColorPicker colorHex={colorHex} onChange={setColorHex} />
                <div className="flex-1">
                  <label className="block text-xs text-text-secondary mb-1">
                    Hex Code
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                      #
                    </span>
                    <input
                      type="text"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-full bg-bg-main border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-accent text-text-primary uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Initial Weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightTotal}
                    onChange={(e) => setWeightTotal(e.target.value)}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary text-right pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                    g
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Empty Spool
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={emptySpoolWeight}
                    onChange={(e) => setEmptySpoolWeight(e.target.value)}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary text-right pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                    g
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Price per Spool
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                  {settings.currency === "USD" ? "$" : settings.currency}
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => {
              setEditingFilamentId(null);
              onNavigate("inventory");
            }}
            className="px-6 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-bg-main transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            {editingFilament ? "Save Changes" : "Save Filament"}
          </button>
        </div>
      </div>
    </div>
  );
}
