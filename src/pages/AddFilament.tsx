import React, { useState } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";

interface AddFilamentProps {
  onNavigate: (page: Page) => void;
}

export default function AddFilament({ onNavigate }: AddFilamentProps) {
  const { addFilament, settings } = useAppContext();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState(settings.manufacturers[0] || "");
  const [material, setMaterial] = useState(settings.materials[0] || "");
  const [colorHex, setColorHex] = useState("8B5CF6");
  const [weightTotal, setWeightTotal] = useState("1000");
  const [emptySpoolWeight, setEmptySpoolWeight] = useState("200");
  const [price, setPrice] = useState("");

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

    onNavigate("inventory");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-sm text-gray-400 flex items-center gap-2">
        <button
          onClick={() => onNavigate("inventory")}
          className="hover:text-gray-200"
        >
          Inventory
        </button>
        <span>/</span>
        <span className="text-gray-200">Add Filament</span>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Add New Filament</h1>
        <p className="text-gray-400">
          Enter the details of your new filament spool to track it in your local
          inventory.
        </p>
      </div>

      <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Filament Name
              </label>
              <input
                type="text"
                placeholder="e.g. Matte Navy Blue"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-gray-200 appearance-none"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Material Type
              </label>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-gray-200 appearance-none"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Color
              </label>
              <div className="flex gap-3">
                <div
                  className="relative w-10 h-10 rounded-lg border border-border shrink-0 overflow-hidden focus-within:ring-2 focus-within:ring-accent"
                  style={{ backgroundColor: `#${colorHex.replace("#", "")}` }}
                >
                  <input
                    type="color"
                    value={`#${colorHex.replace("#", "")}`}
                    onChange={(e) => setColorHex(e.target.value.replace("#", ""))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">
                    Hex Code
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      #
                    </span>
                    <input
                      type="text"
                      value={colorHex}
                      onChange={(e) => setColorHex(e.target.value)}
                      className="w-full bg-bg-main border border-border rounded-lg pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-accent text-gray-200 uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Initial Weight
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weightTotal}
                    onChange={(e) => setWeightTotal(e.target.value)}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-gray-200 text-right pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    g
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Empty Spool
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={emptySpoolWeight}
                    onChange={(e) => setEmptySpoolWeight(e.target.value)}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-gray-200 text-right pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    g
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Price per Spool
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {settings.currency === "USD" ? "$" : settings.currency}
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-lg pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent text-gray-200"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 pt-6 border-t border-border flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={() => onNavigate("inventory")}
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
            Save Filament
          </button>
        </div>
      </div>
    </div>
  );
}
