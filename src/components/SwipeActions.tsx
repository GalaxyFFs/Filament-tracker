import React from "react";
import { Trash2 } from "lucide-react";

interface SwipeActionsProps {
  offset: number;
  actionsWidth: number;
  onDelete: () => void;
  onDeplete: () => void;
  onEdit?: () => void;
}

export default function SwipeActions({ offset, actionsWidth, onDelete, onDeplete, onEdit }: SwipeActionsProps) {
  // Only show actions when swiped past a threshold
  const isVisible = offset < -40;

  return (
    <div
      className="absolute right-0 top-0 bottom-0 flex items-center gap-2 pr-4 pointer-events-none"
      style={{ width: actionsWidth, opacity: isVisible ? 1 : 0, transform: `translateX(${Math.max(0, offset + actionsWidth)}px)` }}
    >
      {onEdit && (
        <button
          onClick={onEdit}
          className="swipe-action-button bg-blue-500 text-white pointer-events-auto"
          aria-label="Edit"
        >
          <span className="text-lg">✏️</span>
          <span className="swipe-action-caption">Edit</span>
        </button>
      )}
      <button
        onClick={onDeplete}
        className="swipe-action-button bg-action-blue text-white pointer-events-auto"
        aria-label="Mark as depleted"
      >
        <span className="font-bold text-lg">0g</span>
        <span className="swipe-action-caption">Depleted</span>
      </button>
      <button
        onClick={onDelete}
        className="swipe-action-button bg-danger-red text-white pointer-events-auto"
        aria-label="Delete"
      >
        <Trash2 className="w-5 h-5" />
        <span className="swipe-action-caption">Delete</span>
      </button>
    </div>
  );
}