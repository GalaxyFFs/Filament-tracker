import React, { useState } from "react";
import {
  Palette,
  Sliders,
  Factory,
  Edit2,
  Trash2,
  Plus,
  Check,
  Download,
  Upload,
  Database
} from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";

interface SettingsProps {
  onNavigate: (page: Page) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const { settings, updateSettings, filaments, printJobs, restoreData } = useAppContext();
  const [newBrand, setNewBrand] = useState("");
  const [isAddingBrand, setIsAddingBrand] = useState(false);

  const handleAddBrand = () => {
    if (newBrand.trim() && !settings.manufacturers.includes(newBrand.trim())) {
      updateSettings({
        manufacturers: [...settings.manufacturers, newBrand.trim()],
      });
      setNewBrand("");
      setIsAddingBrand(false);
    }
  };

  const handleDeleteBrand = (brand: string) => {
    updateSettings({
      manufacturers: settings.manufacturers.filter((m) => m !== brand),
    });
  };

  const handleBackup = () => {
    const data = { filaments, printJobs, settings };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `my-filament-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        if (data.filaments && data.printJobs && data.settings) {
          restoreData(data);
          alert("Data successfully restored!");
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Error parsing backup file.");
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-gray-400">
          Configure your environment and manage local data
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Palette className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg">Appearance</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-200 mb-1">Theme</h3>
                <p className="text-sm text-gray-400">
                  Select your preferred interface theme.
                </p>
              </div>
              <div className="flex bg-bg-main border border-border rounded-lg p-1">
                <button
                  onClick={() => updateSettings({ theme: "light" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${settings.theme === "light" ? "bg-bg-card text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Light
                </button>
                <button
                  onClick={() => updateSettings({ theme: "dark" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 ${settings.theme === "dark" ? "bg-bg-card text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
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
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  Dark
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div>
                <h3 className="font-medium text-gray-200 mb-1">Accent Color</h3>
                <p className="text-sm text-gray-400">
                  Customize the primary color of the application.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateSettings({ accentColor: "#3b82f6" })}
                  className={`w-8 h-8 rounded-full bg-blue-500 ${settings.accentColor === "#3b82f6" ? "ring-2 ring-offset-2 ring-offset-bg-card ring-blue-500" : ""}`}
                ></button>
                <button
                  onClick={() => updateSettings({ accentColor: "#8b5cf6" })}
                  className={`w-8 h-8 rounded-full bg-purple-500 ${settings.accentColor === "#8b5cf6" ? "ring-2 ring-offset-2 ring-offset-bg-card ring-purple-500" : ""}`}
                ></button>
                <button
                  onClick={() => updateSettings({ accentColor: "#10b981" })}
                  className={`w-8 h-8 rounded-full bg-emerald-500 ${settings.accentColor === "#10b981" ? "ring-2 ring-offset-2 ring-offset-bg-card ring-emerald-500" : ""}`}
                ></button>
                <button
                  onClick={() => updateSettings({ accentColor: "#f97316" })}
                  className={`w-8 h-8 rounded-full bg-orange-500 ${settings.accentColor === "#f97316" ? "ring-2 ring-offset-2 ring-offset-bg-card ring-orange-500" : ""}`}
                ></button>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Preferences */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg">Unit Preferences</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-200 mb-1">
                  Weight Display Unit
                </h3>
                <p className="text-sm text-gray-400">
                  Choose how filament weight is displayed across the app.
                </p>
              </div>
              <div className="flex bg-bg-main border border-border rounded-lg p-1">
                <button
                  onClick={() => updateSettings({ weightUnit: "g" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.weightUnit === "g" ? "bg-bg-card text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
                >
                  Grams (g)
                </button>
                <button
                  onClick={() => updateSettings({ weightUnit: "kg" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.weightUnit === "kg" ? "bg-bg-card text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
                >
                  Kilograms (kg)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-border">
              <div>
                <h3 className="font-medium text-gray-200 mb-1">Currency</h3>
                <p className="text-sm text-gray-400">
                  Define your preferred currency symbol or code.
                </p>
              </div>
              <div className="flex bg-bg-main border border-border rounded-lg p-1">
                <button
                  onClick={() => updateSettings({ currency: "USD" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.currency === "USD" ? "bg-bg-card text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
                >
                  USD
                </button>
                <button
                  onClick={() => updateSettings({ currency: "EUR" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.currency === "EUR" ? "bg-bg-card text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
                >
                  EUR
                </button>
                <button
                  onClick={() => updateSettings({ currency: "CZK" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.currency === "CZK" ? "bg-bg-card text-white shadow" : "text-gray-400 hover:text-gray-200"}`}
                >
                  CZK
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Manufacturer Management */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Factory className="w-4 h-4 text-accent" />
              </div>
              <h2 className="font-bold text-lg">Manufacturer Management</h2>
            </div>
            <button
              onClick={() => setIsAddingBrand(true)}
              className="text-sm font-medium text-accent hover:text-accent-hover flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Brand
            </button>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-400 mb-4">
              Manage the list of filament manufacturers.
            </p>

            {isAddingBrand && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Brand name..."
                  className="bg-bg-main border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-accent text-gray-200"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddBrand()}
                />
                <button
                  onClick={handleAddBrand}
                  className="p-1.5 bg-accent text-white rounded-lg hover:bg-accent-hover"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddingBrand(false)}
                  className="p-1.5 bg-bg-main border border-border text-gray-400 rounded-lg hover:text-gray-200"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {settings.manufacturers.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center justify-between p-4 bg-bg-main border border-border rounded-xl"
                >
                  <span className="font-medium">{brand}</span>
                  <div className="flex gap-2 text-gray-500">
                    <button
                      onClick={() => handleDeleteBrand(brand)}
                      className="hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-accent" />
            </div>
            <h2 className="font-bold text-lg">Data Management</h2>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-400">
              Backup your data locally or restore from a previous backup.
              Restoring a backup will overwrite your current data.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleBackup}
                className="flex items-center gap-2 px-4 py-2 bg-bg-main border border-border rounded-lg text-sm font-medium hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Backup Data
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-bg-main border border-border rounded-lg text-sm font-medium hover:text-white transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Restore Data
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleRestore}
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
