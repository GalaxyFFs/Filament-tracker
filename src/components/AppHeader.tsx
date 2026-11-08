import React from "react";
import { ChevronLeft } from "lucide-react";

interface AppHeaderProps {
  title: string;
  onBack: () => void;
}

export default function AppHeader({ title, onBack }: AppHeaderProps) {
  return (
    <header className="bg-surface border-b border-surface-divider sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg hover:bg-surface-divider transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-lg font-bold text-text-primary flex-1 text-center">{title}</h1>
        <div className="w-10" />
      </div>
    </header>
  );
}