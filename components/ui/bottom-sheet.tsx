"use client";

import { type ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: BottomSheetProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 rounded-t-[2rem] border border-white/10 bg-zinc-950 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))] pt-4 shadow-[0_-20px_80px_-40px_rgba(0,0,0,0.95)]",
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/10" />
        <div className="space-y-1">
          <h2 id="bottom-sheet-title" className="text-lg font-semibold text-zinc-50">
            {title}
          </h2>
          {description ? <p className="text-sm text-zinc-400">{description}</p> : null}
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
