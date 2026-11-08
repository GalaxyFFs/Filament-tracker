import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export default function PrimaryButton({ children, onClick, disabled = false, className = "", fullWidth = true }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        pill-button
        bg-primary-green text-white
        hover:bg-primary-green-hover
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}