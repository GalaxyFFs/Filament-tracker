import React from "react";

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div className={`bg-surface border border-surface-divider rounded-[24px] p-6 ${className}`}>
      {children}
    </div>
  );
}

export function FormRow({
  label,
  required = false,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-3 ${className}`}>
      <label className="flex items-center gap-2 text-base font-medium text-text-primary">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className="flex-1 text-right">{children}</div>
    </div>
  );
}

export function FormDivider() {
  return <div className="form-divider my-2" />;
}