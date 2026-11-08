import React from "react";
import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export default function NumberStepper({ value, onChange, min = 1, max = 99, disabled = false, className = "" }: NumberStepperProps) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };
  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className={`flex items-center justify-end gap-2 ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || value <= min}
        className={`p-2 rounded-lg border border-surface-divider text-text-primary hover:bg-surface transition-colors ${value <= min || disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        aria-label="Decrease"
      >
        <Minus className="w-5 h-5" />
      </button>
      <span className="w-12 text-center text-base font-medium text-text-primary">{value}</span>
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || value >= max}
        className={`p-2 rounded-lg border border-surface-divider text-text-primary hover:bg-surface transition-colors ${value >= max || disabled ? "opacity-40 cursor-not-allowed" : ""}`}
        aria-label="Increase"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}