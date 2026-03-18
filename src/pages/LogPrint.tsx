import React, { useState, useMemo } from "react";
import { Page } from "../App";
import { useAppContext } from "../context/AppContext";

interface LogPrintProps {
  onNavigate: (page: Page) => void;
}

export default function LogPrint({ onNavigate }: LogPrintProps) {
  const { filaments, printJobs, updateFilament, addPrintJob, updatePrintJob, settings, editingPrintJobId, setEditingPrintJobId } = useAppContext();

  const editingJob = useMemo(
    () => editingPrintJobId ? printJobs.find((j) => j.id === editingPrintJobId) : null,
    [printJobs, editingPrintJobId]
  );

  const [modelName, setModelName] = useState(editingJob?.modelName || "");
  const [filamentId, setFilamentId] = useState(
    editingJob ? editingJob.filamentId : (filaments.length > 0 ? filaments[0].id : "")
  );
  const [weight, setWeight] = useState(editingJob ? editingJob.weightUsed.toString() : "");
  const [waste, setWaste] = useState("");

  const selectedFilament = useMemo(
    () => filaments.find((f) => f.id === filamentId),
    [filaments, filamentId],
  );

  const totalWeight = (Number(weight) || 0) + (Number(waste) || 0);
  const estimatedCost = selectedFilament
    ? (totalWeight / Number(selectedFilament.weightTotal)) * selectedFilament.price
    : 0;

  const handleSave = () => {
    if (!modelName || !filamentId || totalWeight <= 0) {
      alert("Please fill in all required fields");
      return;
    }

    const weightDiff = editingJob 
      ? (editingJob.filamentId === filamentId ? totalWeight - editingJob.weightUsed : totalWeight) 
      : totalWeight;
      
    if (selectedFilament && weightDiff > Number(selectedFilament.weightRemaining)) {
      alert("Not enough filament remaining!");
      return;
    }

    if (editingJob) {
      if (editingJob.filamentId === filamentId) {
        updatePrintJob(editingJob.id, { modelName, filamentId, weightUsed: totalWeight, cost: estimatedCost });
        if (selectedFilament) {
          updateFilament(filamentId, { weightRemaining: Math.max(0, selectedFilament.weightRemaining - weightDiff) });
        }
      } else {
        const oldFilament = filaments.find(f => f.id === editingJob.filamentId);
        if (oldFilament) {
           updateFilament(oldFilament.id, { weightRemaining: oldFilament.weightRemaining + editingJob.weightUsed });
        }
        if (selectedFilament) {
           updateFilament(filamentId, { weightRemaining: Math.max(0, selectedFilament.weightRemaining - totalWeight) });
        }
        updatePrintJob(editingJob.id, { modelName, filamentId, weightUsed: totalWeight, cost: estimatedCost });
      }
      setEditingPrintJobId(null);
    } else {
      addPrintJob({
        modelName,
        filamentId,
        weightUsed: totalWeight,
        cost: estimatedCost,
        date: new Date().toISOString().split("T")[0],
      });
    }

    onNavigate("history");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-sm text-text-secondary flex items-center gap-2">
        <button
          onClick={() => onNavigate("history")}
          className="hover:text-text-primary"
        >
          History
        </button>
        <span>/</span>
        <span className="text-text-primary">Log Print</span>
      </div>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          {editingJob ? "Edit Print Job" : "Log New Print Job"}
        </h1>
        <p className="text-text-secondary">
          Record details of your print to update inventory automatically.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <div className="w-full flex-1 bg-bg-card border border-border rounded-2xl p-6 md:p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Model Name
              </label>
              <input
                type="text"
                placeholder="e.g. Benchy Boat v2"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Filament Used
              </label>
              <div className="relative">
                <select
                  value={filamentId}
                  onChange={(e) => setFilamentId(e.target.value)}
                  className="w-full bg-bg-main border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary appearance-none"
                >
                  <option value="" disabled>
                    Select a filament...
                  </option>
                  {filaments
                    .filter((f) => f.weightRemaining > 0)
                    .map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.brand}) - {f.weightRemaining}g remaining
                      </option>
                    ))}
                </select>
                <div
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full ring-1 ring-white/20"
                  style={{
                    backgroundColor: selectedFilament?.colorHex || "#111827",
                  }}
                ></div>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-text-secondary mt-2">
                Select the spool used for this print.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Weight of Print
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary text-right pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                    grams
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Estimated Waste/Supports <span className="text-text-secondary font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={waste}
                    onChange={(e) => setWaste(e.target.value)}
                    className="w-full bg-bg-main border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-accent text-text-primary text-right pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-secondary text-sm">
                    grams
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSave}
                className="flex-1 px-6 py-3 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-hover transition-colors flex items-center justify-center gap-2"
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
                Confirm & Deduct Weight
              </button>
              <button
                onClick={() => {
                  setEditingPrintJobId(null);
                  onNavigate("history");
                }}
                className="px-6 py-3 border border-border rounded-lg text-sm font-medium hover:bg-bg-main transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 bg-bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-accent/20 flex items-center justify-center">
              <svg
                className="w-3.5 h-3.5 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-lg">Print Summary</h3>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <span className="text-text-secondary text-sm">Total Weight</span>
              <span className="font-bold">{totalWeight} g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">Estimated Cost</span>
              <span className="font-bold text-emerald-400 text-xl">
                {settings.currency === "USD" ? "$" : ""}
                {estimatedCost.toFixed(2)}
                {settings.currency !== "USD" ? ` ${settings.currency}` : ""}
              </span>
            </div>
          </div>

          <div className="bg-bg-main rounded-xl p-4 border border-border">
            <h4 className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-3">
              Filament Update
            </h4>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs text-text-secondary">Current Spool</p>
                <p className="font-bold">
                  {selectedFilament ? selectedFilament.weightRemaining : 0}g
                </p>
              </div>
              <svg
                className="w-4 h-4 text-text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <div className="text-right">
                <p className="text-xs text-text-secondary">New Weight</p>
                <p className="font-bold text-accent">
                  {selectedFilament
                    ? Math.max(
                      0,
                      Number(selectedFilament.weightRemaining) - totalWeight,
                    )
                    : 0}
                  g
                </p>
              </div>
            </div>
            <div className="w-full bg-border rounded-full h-1.5 mt-3">
              <div
                className="bg-accent h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${selectedFilament ? Math.max(0, ((Number(selectedFilament.weightRemaining) - totalWeight) / Number(selectedFilament.weightTotal)) * 100) : 0}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
