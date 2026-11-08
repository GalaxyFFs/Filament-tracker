import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FilterChipProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function FilterChip({ label, options, value, onChange, placeholder }: FilterChipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = value || placeholder || "All";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="filter-chip"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{label}</span>
        <span className="text-text-primary font-medium">{displayValue}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-surface border border-surface-divider rounded-lg shadow-lg z-50 overflow-hidden"
          role="listbox"
        >
          <button
            onClick={() => onChange("")}
            className={`w-full px-4 py-2 text-left text-sm ${!value ? "bg-primary-green/20 text-primary-green" : "text-text-primary hover:bg-surface-divider"}`}
            role="option"
            aria-selected={!value}
          >
            {placeholder || "All"}
          </button>
          <div className="border-t border-surface-divider" />
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`w-full px-4 py-2 text-left text-sm ${value === opt ? "bg-primary-green/20 text-primary-green" : "text-text-primary hover:bg-surface-divider"}`}
              role="option"
              aria-selected={value === opt}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}