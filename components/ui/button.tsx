import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "ghost" | "outline" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-black text-zinc-50 border border-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:bg-zinc-900",
  secondary:
    "bg-zinc-900 text-zinc-100 border border-zinc-800 hover:bg-zinc-800",
  ghost:
    "bg-transparent text-zinc-300 border border-transparent hover:bg-zinc-900 hover:text-zinc-100",
  outline:
    "bg-zinc-950 text-zinc-200 border border-zinc-800 hover:bg-zinc-900",
  destructive:
    "bg-zinc-950 text-red-200 border border-red-950/80 hover:bg-red-950/20 hover:text-red-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-xs",
  lg: "h-12 px-5 text-sm",
  icon: "size-11 p-0",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
