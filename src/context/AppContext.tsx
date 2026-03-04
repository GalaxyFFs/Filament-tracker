import React, { createContext, useContext, useState, useEffect } from "react";
import { Filament, PrintJob, Settings } from "../types";

const generateId = () => {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch (e) {
    console.warn("crypto.randomUUID failed, falling back to basic ID generator", e);
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

interface AppState {
  filaments: Filament[];
  printJobs: PrintJob[];
  settings: Settings;
  addFilament: (filament: Omit<Filament, "id">) => void;
  updateFilament: (id: string, filament: Partial<Filament>) => void;
  deleteFilament: (id: string) => void;
  addPrintJob: (job: Omit<PrintJob, "id">) => void;
  updatePrintJob: (id: string, job: Partial<PrintJob>) => void;
  deletePrintJob: (id: string) => void;
  updateSettings: (settings: Partial<Settings>) => void;
  restoreData: (data: { filaments: Filament[]; printJobs: PrintJob[]; settings: Settings }) => void;
}

const defaultSettings: Settings = {
  theme: "dark",
  accentColor: "#8b5cf6",
  weightUnit: "g",
  currency: "USD",
  manufacturers: [
    "Prusament",
    "Bambu Lab",
    "eSun",
    "Sunlu",
    "Polymaker",
    "Hatchbox",
    "Overture",
    "Eryone",
    "Anycubic",
    "Creality",
    "Elegoo",
    "Generic",
  ],
  materials: [
    "PLA",
    "PLA+",
    "PETG",
    "ABS",
    "ASA",
    "TPU",
    "Nylon",
    "PC",
    "HIPS",
    "PVA",
    "Wood-fill",
    "Carbon-fiber",
  ],
};

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [filaments, setFilaments] = useState<Filament[]>(() => {
    const saved = localStorage.getItem("filaments");
    return saved ? JSON.parse(saved) : [];
  });

  const [printJobs, setPrintJobs] = useState<PrintJob[]>(() => {
    const saved = localStorage.getItem("printJobs");
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("settings");
    return saved
      ? { ...defaultSettings, ...JSON.parse(saved) }
      : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem("filaments", JSON.stringify(filaments));
  }, [filaments]);

  useEffect(() => {
    localStorage.setItem("printJobs", JSON.stringify(printJobs));
  }, [printJobs]);

  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));

    document.documentElement.style.setProperty(
      "--theme-accent",
      settings.accentColor,
    );

    // Calculate a slightly darker hover color
    const hex = settings.accentColor.replace("#", "");
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - 20);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - 20);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - 20);
    const hoverColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    document.documentElement.style.setProperty(
      "--theme-accent-hover",
      hoverColor,
    );

    if (settings.theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }

    // Update Favicon dynamically
    const svgIcon = encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${settings.accentColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="M3.27 6.96L12 12.01l8.73-5.05"></path><path d="M12 22.08V12"></path></svg>`
    );
    let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = `data:image/svg+xml,${svgIcon}`;
  }, [settings]);

  const addFilament = (filament: Omit<Filament, "id">) => {
    const newFilament = { ...filament, id: generateId() };
    setFilaments([...filaments, newFilament]);
  };

  const updateFilament = (id: string, updates: Partial<Filament>) => {
    setFilaments(
      filaments.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
  };

  const deleteFilament = (id: string) => {
    setFilaments(filaments.filter((f) => f.id !== id));
  };

  const addPrintJob = (job: Omit<PrintJob, "id">) => {
    const newJob = { ...job, id: generateId() };
    setPrintJobs([...printJobs, newJob]);

    const filament = filaments.find((f) => f.id === job.filamentId);
    if (filament) {
      updateFilament(filament.id, {
        weightRemaining: Math.max(0, filament.weightRemaining - job.weightUsed),
      });
    }
  };

  const updatePrintJob = (id: string, updates: Partial<PrintJob>) => {
    setPrintJobs(
      printJobs.map((j) => (j.id === id ? { ...j, ...updates } : j)),
    );
  };

  const deletePrintJob = (id: string) => {
    setPrintJobs(printJobs.filter((j) => j.id !== id));
  };

  const updateSettings = (updates: Partial<Settings>) => {
    setSettings({ ...settings, ...updates });
  };

  const restoreData = (data: { filaments: Filament[]; printJobs: PrintJob[]; settings: Settings }) => {
    if (data.filaments) setFilaments(data.filaments);
    if (data.printJobs) setPrintJobs(data.printJobs);
    if (data.settings) setSettings(data.settings);
  };

  return (
    <AppContext.Provider
      value={{
        filaments,
        printJobs,
        settings,
        addFilament,
        updateFilament,
        deleteFilament,
        addPrintJob,
        updatePrintJob,
        deletePrintJob,
        updateSettings,
        restoreData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
}
