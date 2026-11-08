import React from "react";

interface SectionHeaderProps {
  children: React.ReactNode;
}

export default function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <div className="px-4 py-2">
      <h2 className="text-base font-bold text-text-primary">{children}</h2>
    </div>
  );
}