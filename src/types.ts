export interface Filament {
  id: string;
  name: string;
  brand: string;
  material: string;
  colorHex: string;
  weightRemaining: number;
  weightTotal: number;
  price: number;
  emptySpoolWeight: number;
}

export interface PrintJob {
  id: string;
  modelName: string;
  date: string;
  filamentId: string;
  weightUsed: number;
  cost: number;
}

export interface Settings {
  theme: "light" | "dark";
  accentColor: string;
  weightUnit: "g" | "kg";
  currency: string;
  manufacturers: string[];
  materials: string[];
}
