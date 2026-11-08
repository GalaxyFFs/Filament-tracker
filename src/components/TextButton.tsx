import React from "react";

interface TextButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "destructive";
  className?: string;
}

export default function TextButton({ children, onClick, variant = "default", className = "" }: TextButtonProps) {
  const baseClass = "text-sm font-medium transition-colors";
  const variantClass = variant === "destructive"
    ? "text-danger-red hover:text-danger-red/80"
    : "text-text-primary hover:text-text-secondary";

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${variantClass} ${className}`}
    >
      {children}
    </button>
  );
}