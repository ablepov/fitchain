"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  indicatorClassName?: string;
  value?: number;
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, indicatorClassName, value = 0, ...props }, ref) => {
    const boundedValue = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(boundedValue)}
        className={cn("relative h-2 w-full overflow-hidden rounded-full bg-zinc-900", className)}
        {...props}
      >
        <div
          className={cn("h-full w-full bg-zinc-100 transition-transform", indicatorClassName)}
          style={{ transform: `translateX(-${100 - boundedValue}%)` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";
