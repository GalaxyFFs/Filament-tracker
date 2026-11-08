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
  Database,
  Layers,
  Calendar
} from "lucide-react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";
import { sanitizeBackupData } from "../utils/validation";
import { useToast } from "../context/ToastContext";

interface SettingsProps {
  onNavigate: (page: Page) => void;
}

export default function Settings({ onNavigate }: SettingsProps) {
  const { settings, updateSettings, filaments, printJobs, restoreData } = useAppContext();
  const { showToast } = useToast();
  const [newBrand, setNewBrand] = useState("");
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [newMaterial, setNewMaterial] = useState("");
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);

  const handleAddBrand = () => {
    if (newBrand.trim() && !settings.manufacturers.includes(newBrand.trim())) {
      updateSettings({
        manufacturers: [...settings.manufacturers, newBrand.trim()],
      });
      setNewBrand("");
      setIsAddingBrand(false);
      showToast("Brand added", "success");
    }
  };

  const handleDeleteBrand = (brand: string) => {
    if (window.confirm(`Delete "${brand}"? This cannot be undone.`)) {
      updateSettings({
        manufacturers: settings.manufacturers.filter((m) => m !== brand),
      });
      showToast("Brand deleted", "success");
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim() && !settings.materials.includes(newMaterial.trim())) {
      updateSettings({
        materials: [...settings.materials, newMaterial.trim()],
      });
      setNewMaterial("");
      setIsAddingMaterial(false);
      showToast("Material added", "success");
    }
  };

  const handleDeleteMaterial = (material: string) => {
    if (window.confirm(`Delete "${material}"? This cannot be undone.`)) {
      updateSettings({
        materials: settings.materials.filter((m) => m !== material),
      });
      showToast("Material deleted", "success");
    }
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
    showToast("Backup downloaded", "success");
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        const sanitized = sanitizeBackupData(data);
        if (sanitized) {
          restoreData(sanitized);
          showToast("Data successfully restored!", "success");
        } else {
          showToast("Invalid backup file format or data validation failed.", "error");
        }
      } catch (error) {
        showToast("Error parsing backup file.", "error");
        console.error("Error parsing backup file:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleClearData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete ALL your data? This action cannot be undone."
      )
    ) {
      localStorage.clear();
      showToast("All data cleared", "warning");
      setTimeout(() => window.location.reload(), 500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Settings</h1>
        <p className="text-text-secondary">
          Configure your environment and manage local data
        </p>
      </div>

      <div className="space-y-8 sm:space-y-6">
        {/* Appearance */}
        <div className="bg-surface border border-surface-divider rounded-[24px] overflow-hidden">
          <div className="p-5 border-b border-surface-divider flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-green/15 flex items-center justify-center">
              <Palette className="w-4 h-4 text-primary-green" />
            </div>
            <h2 className="font-bold text-lg">Appearance</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-surface-divider">
              <div>
                <h3 className="font-medium text-text-primary mb-1">Accent Color</h3>
                <p className="text-sm text-text-secondary">
                  Customize the primary color of the application.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateSettings({ accentColor: "#4FB536" })}
                  className={`w-8 h-8 rounded-full bg-[#4FB536] ${settings.accentColor === "#4FB536" ? "ring-2 ring-offset-2 ring-offset-surface ring-primary-green" : ""}`}
                ></button>
                <button
                  onClick={() => updateSettings({ accentColor: "#3E7BF5" })}
                  className={`w-8 h-8 rounded-full bg-action-blue ${settings.accentColor === "#3E7BF5" ? "ring-2 ring-offset-2 ring-offset-surface ring-action-blue" : ""}`}
                ></button>
                <button
                  onClick={() => updateSettings({ accentColor: "#EE7739" })}
                  className={`w-8 h-8 rounded-full bg-filament-orange ${settings.accentColor === "#EE7739" ? "ring-2 ring-offset-2 ring-offset-surface ring-filament-orange" : ""}`}
                ></button>
                <button
                  onClick={() => updateSettings({ accentColor: "#C94642" })}
                  className={`w-8 h-8 rounded-full bg-danger-red ${settings.accentColor === "#C94642" ? "ring-2 ring-offset-2 ring-offset-surface ring-danger-red" : ""}`}
                ></button>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Preferences */}
        <div className="bg-surface border border-surface-divider rounded-[24px] overflow-hidden">
          <div className="p-5 border-b border-surface-divider flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-green/15 flex items-center justify-center">
              <Sliders className="w-4 h-4 text-primary-green" />
            </div>
            <h2 className="font-bold text-lg">Unit Preferences</h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-text-primary mb-1">
                  Weight Display Unit
                </h3>
                <p className="text-sm text-text-secondary">
                  Choose how filament weight is displayed across the app.
                </p>
              </div>
              <div className="flex flex-wrap bg-bg border border-surface-divider rounded-lg p-1">
                <button
                  onClick={() => updateSettings({ weightUnit: "g" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.weightUnit === "g" ? "bg-surface text-text-primary shadow" : "text-text-secondary hover:text-text-primary"}`}
                >
                  Grams (g)
                </button>
                <button
                  onClick={() => updateSettings({ weightUnit: "kg" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.weightUnit === "kg" ? "bg-surface text-text-primary shadow" : "text-text-secondary hover:text-text-primary"}`}
                >
                  Kilograms (kg)
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-surface-divider">
              <div>
                <h3 className="font-medium text-text-primary mb-1">Currency</h3>
                <p className="text-sm text-text-secondary">
                  Define your preferred currency symbol or code.
                </p>
              </div>
              <div className="flex flex-wrap bg-bg border border-surface-divider rounded-lg p-1">
                <button
                  onClick={() => updateSettings({ currency: "USD" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.currency === "USD" ? "bg-surface text-text-primary shadow" : "text-text-secondary hover:text-text-primary"}`}
                >
                  USD
                </button>
                <button
                  onClick={() => updateSettings({ currency: "EUR" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.currency === "EUR" ? "bg-surface text-text-primary shadow" : "text-text-secondary hover:text-text-primary"}`}
                >
                  EUR
                </button>
                <button
                  onClick={() => updateSettings({ currency: "CZK" })}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md ${settings.currency === "CZK" ? "bg-surface text-text-primary shadow" : "text-text-secondary hover:text-text-primary"}`}
                >
                  CZK
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-surface-divider">
              <div>
                <h3 className="font-medium text-text-primary mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date Format
                </h3>
                <p className="text-sm text-text-secondary">
                  Choose your preferred date display format.
                </p>
              </div>
              <div className="flex flex-wrap gap-1 bg-bg border border-surface-divider rounded-lg p-1">
                {([
                  ["en-US", "US (MM/DD/YYYY)"],
                  ["en-GB", "UK (DD/MM/YYYY)"],
                  ["de-DE", "DE (DD.MM.YYYY)"],
                  ["fr-FR", "FR (DD/MM/YYYY)"],
                  ["cs-CZ", "CZ (DD.MM.YYYY)"],
                  ["ja-JP", "JP (YYYY/MM/DD)"],
                  ["zh-CN", "CN (YYYY/MM/DD)"],
                ] as const).map(([locale, label]) => (
                  <button
                    key={locale}
                    onClick={() => updateSettings({ dateLocale: locale })}
                    className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-md ${settings.dateLocale === locale ? "bg-surface text-text-primary shadow" : "text-text-secondary hover:text-text-primary"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Manufacturer Management */}
        <div className="bg-surface border border-surface-divider rounded-[24px] overflow-hidden">
          <div className="p-5 border-b border-surface-divider flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-green/15 flex items-center justify-center">
                <Factory className="w-4 h-4 text-primary-green" />
              </div>
              <h2 className="font-bold text-lg">Manufacturer Management</h2>
            </div>
            <button
              onClick={() => setIsAddingBrand(true)}
              className="text-sm font-medium text-primary-green hover:text-primary-green/80 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Brand
            </button>
          </div>

          <div className="p-6">
            <p className="text-sm text-text-secondary mb-4">
              Manage the list of filament manufacturers.
            </p>

            {isAddingBrand && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  placeholder="Brand name..."
                  className="bg-bg border border-surface-divider rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-green text-text-primary"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddBrand()}
                />
                <button
                  onClick={handleAddBrand}
                  className="p-1.5 bg-primary-green text-bg rounded-lg hover:bg-primary-green-hover"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddingBrand(false)}
                  className="p-1.5 bg-bg border border-surface-divider text-text-secondary rounded-lg hover:text-text-primary"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {settings.manufacturers.map((brand) => (
                <div
                  key={brand}
                  className="flex items-center justify-between p-4 bg-bg border border-surface-divider rounded-xl"
                >
                  <span className="font-medium">{brand}</span>
                  <div className="flex gap-2 text-text-secondary">
                    <button
                      onClick={() => handleDeleteBrand(brand)}
                      className="hover:text-danger-red"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Material Management */}
        <div className="bg-surface border border-surface-divider rounded-[24px] overflow-hidden">
          <div className="p-5 border-b border-surface-divider flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-green/15 flex items-center justify-center">
                <Layers className="w-4 h-4 text-primary-green" />
              </div>
              <h2 className="font-bold text-lg">Material Management</h2>
            </div>
            <button
              onClick={() => setIsAddingMaterial(true)}
              className="text-sm font-medium text-primary-green hover:text-primary-green/80 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" /> Add Material
            </button>
          </div>

          <div className="p-6">
            <p className="text-sm text-text-secondary mb-4">
              Manage the list of filament material types.
            </p>

            {isAddingMaterial && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Material type e.g. PETG"
                  className="bg-bg border border-surface-divider rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-primary-green text-text-primary"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && handleAddMaterial()}
                />
                <button
                  onClick={handleAddMaterial}
                  className="p-1.5 bg-primary-green text-bg rounded-lg hover:bg-primary-green-hover"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddingMaterial(false)}
                  className="p-1.5 bg-bg border border-surface-divider text-text-secondary rounded-lg hover:text-text-primary"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {settings.materials.map((material) => (
                <div
                  key={material}
                  className="flex items-center justify-between p-4 bg-bg border border-surface-divider rounded-xl"
                >
                  <span className="font-medium">{material}</span>
                  <div className="flex gap-2 text-text-secondary">
                    <button
                      onClick={() => handleDeleteMaterial(material)}
                      className="hover:text-danger-red"
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
        <div className="bg-surface border border-surface-divider rounded-[24px] overflow-hidden">
          <div className="p-5 border-b border-surface-divider flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-green/15 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary-green" />
            </div>
            <h2 className="font-bold text-lg">Data Management</h2>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-sm text-text-secondary">
              Backup your data locally or restore from a previous backup.
              Restoring a backup will overwrite your current data.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleBackup}
                className="flex items-center gap-2 px-4 py-2 bg-bg border border-surface-divider rounded-lg text-sm font-medium hover:text-text-primary transition-colors"
              >
                <Download className="w-4 h-4" />
                Backup Data
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-bg border border-surface-divider rounded-lg text-sm font-medium hover:text-text-primary transition-colors cursor-pointer">
                <Upload className="w-4 h-4" />
                Restore Data
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleRestore}
                />
              </label>

              <div className="flex-1"></div>

              <button
                onClick={handleClearData}
                className="flex items-center gap-2 px-4 py-2 bg-danger-red/10 text-danger-red border border-danger-red/20 rounded-lg text-sm font-medium hover:bg-danger-red hover:text-white transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}