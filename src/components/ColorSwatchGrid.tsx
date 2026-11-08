import React from "react";
import { ChevronDown } from "lucide-react";

const SWATCH_COLORS = [
  // Row 1
  "FFFFFF", "FFD700", "A8E600", "22C55E", "16A34A", "0D9488", "4ADE80",
  // Row 2
  "60A5FA", "3B82F6", "2563EB", "312E81", "A855F7", "EC4899", "F0ABFC",
  // Row 3
  "FB7185", "EF4444", "A16207", "F97316", "F5E6C8", "D4A574", null, // null = expand button
];

interface ColorSwatchGridProps {
  value: string; // hex without #
  onChange: (hex: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function ColorSwatchGrid({ value, onChange, disabled = false, className = "" }: ColorSwatchGridProps) {
  const [expanded, setExpanded] = React.useState(false);

  const colors = expanded
    ? [...SWATCH_COLORS, ...EXTRA_COLORS]
    : SWATCH_COLORS;

  return (
    <div className={`swatch-grid ${className}`}>
      {colors.map((hex, idx) => {
        if (!hex) {
          return (
            <button
              key="expand"
              type="button"
              onClick={() => setExpanded(!expanded)}
              disabled={disabled}
              className="swatch-button swatch-expand"
              aria-label={expanded ? "Show fewer colors" : "Show more colors"}
            >
              <ChevronDown className={`w-5 h-5 ${expanded ? "collapsible-chevron open" : "collapsible-chevron"}`} />
            </button>
          );
        }
        const isSelected = value.toUpperCase() === hex;
        return (
          <button
            key={hex}
            type="button"
            onClick={() => onChange(hex)}
            disabled={disabled}
            className={`swatch-button ${isSelected ? "selected" : ""}`}
            style={{ backgroundColor: `#${hex}` }}
            aria-label={`Color ${hex}`}
            aria-pressed={isSelected}
          />
        );
      })}
    </div>
  );
}

// Additional colors for expanded state
const EXTRA_COLORS = [
  "FCE7F3", "FBCFE8", "F3F4F6", "E5E7EB", "D1D5DB", "9CA3AF", "6B7280",
  "FEF3C7", "FDE68A", "FCD34D", "FBBF24", "F59E0B", "D97706", "B45309",
  "D1FAE5", "A7F3D0", "6EE7B7", "34D399", "10B981", "059669", "047857",
  "CCFBF1", "99F6E4", "5EEAD4", "2DD4BF", "14B8A6", "0D9488", "0F766E",
  "DBEAFE", "BFDBFE", "93C5FD", "60A5FA", "3B82F6", "2563EB", "1D4ED8",
  "EDE9FE", "DDD6FE", "C4B5FD", "A78BFA", "8B5CF6", "7C3AED", "6D28D9",
  "FAE8FF", "F5D0FE", "F0ABFC", "E879F9", "D946EF", "C026D3", "A21CAF",
  "FCE7F3", "FBCFE8", "F9A8D4", "F472B6", "EC4899", "DB2777", "BE185D",
  "FFEDD5", "FED7AA", "FDBA74", "FB923C", "F97316", "EA580C", "C2410C",
];