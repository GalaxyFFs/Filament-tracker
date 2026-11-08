import React, { useState, useRef, useEffect } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Filament } from "../types";
import { formatNumber } from "../utils/format";
import SwipeActions from "./SwipeActions";

interface FilamentCardProps {
  filament: Filament;
  onDelete: (id: string) => void;
  onDeplete: (id: string) => void;
  onEdit?: (id: string) => void;
  settings?: {
    weightUnit: "g" | "kg";
  };
}

export default function FilamentCard({ filament, onDelete, onDeplete, onEdit, settings }: FilamentCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const actionsWidth = 160; // approximate width of action buttons

  const percentage = Math.max(0, (filament.weightRemaining / filament.weightTotal) * 100);
  const isLow = percentage > 0 && percentage < 15;

  const weightDisplay = settings?.weightUnit === "kg"
    ? formatNumber(filament.weightRemaining / 1000)
    : formatNumber(filament.weightRemaining);
  const totalDisplay = settings?.weightUnit === "kg"
    ? formatNumber(filament.weightTotal / 1000) + "kg"
    : formatNumber(filament.weightTotal) + "g";

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return;
    const touch = e.touches[0];
    if (!touch) return;
    const target = e.target as HTMLElement;
    const rect = target.getBoundingClientRect();
    const deltaX = touch.clientX - rect.left;
    const offset = Math.max(-actionsWidth, Math.min(0, deltaX - (cardRef.current?.offsetWidth || 0)));
    setSwipeOffset(offset);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (swipeOffset < -actionsWidth / 2) {
      setSwipeOffset(-actionsWidth);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setIsSwiping(true);
    const startX = e.clientX;
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isSwiping) return;
      const deltaX = moveEvent.clientX - startX;
      const offset = Math.max(-actionsWidth, Math.min(0, deltaX));
      setSwipeOffset(offset);
    };
    const handleMouseUp = () => {
      setIsSwiping(false);
      if (swipeOffset < -actionsWidth / 2) {
        setSwipeOffset(-actionsWidth);
      } else {
        setSwipeOffset(0);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const closeSwipe = () => setSwipeOffset(0);

  const cardStyle: React.CSSProperties = {
    transform: `translateX(${swipeOffset}px)`,
    transition: isSwiping ? "none" : "transform 0.2s ease-out",
  };

  return (
    <div
      ref={cardRef}
      className="relative bg-surface rounded-[24px] overflow-visible mt-3"
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
    >
      {/* Main card content */}
      <div className="p-4">
        {/* Manufacturer tag (optional) */}
        {filament.brand && filament.brand !== "Generic" && (
          <div className="absolute -top-3 left-4 manufacturer-tag z-10">
            {filament.brand}
          </div>
        )}

        <div className="flex gap-4">
          {/* Color dot */}
          <div
            className="filament-color-dot"
            style={{ backgroundColor: filament.colorHex }}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg truncate pr-2">{filament.name}</h3>
            </div>

            <p className="text-text-secondary text-sm mb-3">{filament.brand}</p>

            {/* Progress bar */}
            <div className="progress-bar-track mb-3">
              <div
                className="progress-bar-fill"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: filament.colorHex,
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-text-secondary text-sm">{filament.material}</span>
              <span className="text-text-primary font-medium">
                {weightDisplay} / {totalDisplay}
              </span>
            </div>

            {isLow && (
              <div className="mt-2 flex items-center gap-1 text-amber-500 text-xs">
                <AlertTriangle className="w-3 h-3" />
                Low stock
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Swipe actions */}
      <SwipeActions
        offset={swipeOffset}
        actionsWidth={actionsWidth}
        onDelete={() => { onDelete(filament.id); closeSwipe(); }}
        onDeplete={() => { onDeplete(filament.id); closeSwipe(); }}
        onEdit={onEdit ? () => { onEdit(filament.id); closeSwipe(); } : undefined}
      />
    </div>
  );
}