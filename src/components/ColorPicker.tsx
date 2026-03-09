import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  colorHex: string;
  onChange: (hex: string) => void;
}

const PRESET_COLORS = [
  "1A1A1A", "FFFFFF", "9CA3AF", "DC2626", 
  "2563EB", "16A34A", "FBBF24", "EA580C",
  "9333EA", "A16207", "FBCFE8", "F3F4F6"
];

export default function ColorPicker({ colorHex, onChange }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace("#", "");
    onChange(val);
  };

  // Safe color for display
  const safeColorHex = colorHex.replace("#", "") || "000000";

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg border border-border shrink-0 focus:outline-none focus:ring-2 focus:ring-accent transition-shadow relative overflow-hidden flex items-center justify-center group"
        style={{ backgroundColor: `#${safeColorHex}` }}
      >
        <span className="sr-only">Choose color</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 left-0 z-50 p-4 bg-bg-card border border-border rounded-xl shadow-xl w-[260px]">
          
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2 font-medium">Preset Colors</label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { onChange(preset); setIsOpen(false); }}
                  className={`w-7 h-7 rounded-full border border-border hover:scale-110 transition-transform ${safeColorHex.toUpperCase() === preset ? 'ring-2 ring-accent ring-offset-2 ring-offset-bg-card' : ''}`}
                  style={{ backgroundColor: `#${preset}` }}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-2 font-medium">More Colors</label>
            <div className="relative h-10 rounded-lg border border-border overflow-hidden hover:opacity-90 transition-opacity">
                <input
                  type="color"
                  value={`#${safeColorHex}`}
                  onChange={handleNativeChange}
                  className="absolute -inset-2 w-[150%] h-[150%] opacity-0 cursor-pointer"
                />
                <div 
                  className="w-full h-full flex items-center justify-center font-medium pointer-events-none" 
                  style={{ backgroundColor: `#${safeColorHex}`}}
                >
                  <span className="px-2 py-1 rounded-md bg-black/50 text-white text-xs backdrop-blur-sm select-none shadow-sm">
                    Open Color Picker
                  </span>
                </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
