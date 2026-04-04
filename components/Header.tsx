import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: ReactNode;
  subtitle?: string;
  showBackButton?: boolean;
  backHref?: string;
}

export function Header({
  title,
  subtitle = "Fitchain",
  showBackButton = false,
  backHref = "/",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-950/80 bg-black/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        {showBackButton ? (
          <Button asChild size="icon" variant="outline" className="size-10 rounded-full">
            <Link href={backHref} aria-label="Назад">
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} />
              </svg>
            </Link>
          </Button>
        ) : null}

        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">{subtitle}</div>
          <div className="mt-1 text-lg font-semibold text-zinc-50">{title}</div>
        </div>
      </div>
    </header>
  );
}
