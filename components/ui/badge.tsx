import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-zinc-400",
        className
      )}
      {...props}
    />
  );
}
