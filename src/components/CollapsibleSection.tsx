import React from "react";
import { ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export default function CollapsibleSection({ title, children, defaultOpen = true, className = "" }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className={`${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="collapsible-header w-full"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <ChevronUp className={`collapsible-chevron w-5 h-5 text-text-secondary ${isOpen ? "open" : ""}`} />
      </button>
      {isOpen && (
        <div className="bg-surface border border-surface-divider rounded-[24px] p-4 mt-2 animate-slide-in">
          {children}
        </div>
      )}
    </div>
  );
}