import { Filament, PrintJob, Settings } from "../types";

const HEX_COLOR_REGEX = /^[0-9a-fA-F]{6}$/;
const VALID_WEIGHT_UNITS = ["g", "kg"] as const;
const VALID_CURRENCIES = ["USD", "EUR", "CZK"] as const;
const COMMON_LOCALES = [
  "en-US", "en-GB", "de-DE", "fr-FR", "es-ES", "it-IT", "pt-PT", "pt-BR",
  "cs-CZ", "sk-SK", "pl-PL", "ru-RU", "ja-JP", "ko-KR", "zh-CN", "zh-TW",
  "nl-NL", "sv-SE", "da-DK", "fi-FI", "nb-NO", "hu-HU", "ro-RO", "tr-TR",
] as const;

export function isValidHexColor(color: string): boolean {
  return HEX_COLOR_REGEX.test(color.replace("#", ""));
}

export function sanitizeHexColor(color: string): string {
  const cleaned = color.replace("#", "").toUpperCase();
  return isValidHexColor(cleaned) ? `#${cleaned}` : "#4FB536";
}

export function isValidNumber(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): boolean {
  const num = Number(value);
  return !isNaN(num) && isFinite(num) && num >= min && num <= max;
}

export function clampNumber(value: unknown, min = 0, max = Number.MAX_SAFE_INTEGER): number {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return min;
  return Math.max(min, Math.min(max, num));
}

export function isValidString(value: unknown, maxLength = 200): boolean {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

export function sanitizeString(value: unknown, maxLength = 200): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLength).trim();
}

export function validateFilament(f: unknown): f is Filament {
  if (!f || typeof f !== "object") return false;
  const filament = f as Record<string, unknown>;

  return (
    isValidString(filament["id"]) &&
    isValidString(filament["name"]) &&
    isValidString(filament["brand"]) &&
    isValidString(filament["material"]) &&
    typeof filament["colorHex"] === "string" &&
    isValidHexColor(String(filament["colorHex"]).replace("#", "")) &&
    isValidNumber(filament["weightRemaining"]) &&
    isValidNumber(filament["weightTotal"]) &&
    isValidNumber(filament["price"]) &&
    isValidNumber(filament["emptySpoolWeight"])
  );
}

export function sanitizeFilament(f: unknown): Filament | null {
  if (!validateFilament(f)) return null;
  const filament = f as Filament;
  return {
    id: sanitizeString(filament.id),
    name: sanitizeString(filament.name),
    brand: sanitizeString(filament.brand),
    material: sanitizeString(filament.material),
    colorHex: sanitizeHexColor(filament.colorHex),
    weightRemaining: clampNumber(filament.weightRemaining),
    weightTotal: clampNumber(filament.weightTotal),
    price: clampNumber(filament.price),
    emptySpoolWeight: clampNumber(filament.emptySpoolWeight),
  };
}

export function validatePrintJob(j: unknown): j is PrintJob {
  if (!j || typeof j !== "object") return false;
  const job = j as Record<string, unknown>;

  return (
    isValidString(job["id"]) &&
    isValidString(job["modelName"]) &&
    isValidString(job["date"]) &&
    isValidString(job["filamentId"]) &&
    isValidNumber(job["weightUsed"]) &&
    isValidNumber(job["cost"])
  );
}

export function sanitizePrintJob(j: unknown): PrintJob | null {
  if (!validatePrintJob(j)) return null;
  const job = j as PrintJob;
  return {
    id: sanitizeString(job.id),
    modelName: sanitizeString(job.modelName),
    date: sanitizeString(job.date),
    filamentId: sanitizeString(job.filamentId),
    weightUsed: clampNumber(job.weightUsed),
    cost: clampNumber(job.cost),
  };
}

export function validateSettings(s: unknown): s is Settings {
  if (!s || typeof s !== "object") return false;
  const settings = s as Record<string, unknown>;

  return (
    typeof settings["accentColor"] === "string" &&
    isValidHexColor(String(settings["accentColor"]).replace("#", "")) &&
    VALID_WEIGHT_UNITS.includes(settings["weightUnit"] as "g" | "kg") &&
    VALID_CURRENCIES.includes(settings["currency"] as "USD" | "EUR" | "CZK") &&
    typeof settings["dateLocale"] === "string" &&
    COMMON_LOCALES.includes(settings["dateLocale"] as typeof COMMON_LOCALES[number]) &&
    Array.isArray(settings["manufacturers"]) &&
    settings["manufacturers"].every((m) => isValidString(m)) &&
    Array.isArray(settings["materials"]) &&
    settings["materials"].every((m) => isValidString(m))
  );
}

export function sanitizeSettings(s: unknown): Settings | null {
  if (!validateSettings(s)) return null;
  const settings = s as Settings;
  return {
    accentColor: sanitizeHexColor(settings.accentColor),
    weightUnit: settings.weightUnit,
    currency: settings.currency,
    dateLocale: settings.dateLocale,
    manufacturers: settings.manufacturers.map(sanitizeString).filter(Boolean),
    materials: settings.materials.map(sanitizeString).filter(Boolean),
  };
}

export function validateBackupData(data: unknown): data is { filaments: Filament[]; printJobs: PrintJob[]; settings: Settings } {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  return (
    Array.isArray(d["filaments"]) &&
    d["filaments"].every(validateFilament) &&
    Array.isArray(d["printJobs"]) &&
    d["printJobs"].every(validatePrintJob) &&
    validateSettings(d["settings"])
  );
}

export function sanitizeBackupData(data: unknown): { filaments: Filament[]; printJobs: PrintJob[]; settings: Settings } | null {
  if (!validateBackupData(data)) return null;
  const d = data as { filaments: Filament[]; printJobs: PrintJob[]; settings: Settings };
  return {
    filaments: d.filaments.map(sanitizeFilament).filter((f): f is Filament => f !== null),
    printJobs: d.printJobs.map(sanitizePrintJob).filter((j): j is PrintJob => j !== null),
    settings: sanitizeSettings(d.settings)!,
  };
}

export function validateLocalStorageFilaments(data: unknown): Filament[] {
  if (!Array.isArray(data)) return [];
  return data.map(sanitizeFilament).filter((f): f is Filament => f !== null);
}

export function validateLocalStoragePrintJobs(data: unknown): PrintJob[] {
  if (!Array.isArray(data)) return [];
  return data.map(sanitizePrintJob).filter((j): j is PrintJob => j !== null);
}

export function validateLocalStorageSettings(data: unknown): Settings | null {
  return sanitizeSettings(data);
}