import Link from "next/link";

export type HomeMode = "today" | "week";

export function normalizeHomeMode(value: string | null | undefined): HomeMode {
  return value === "week" ? "week" : "today";
}

export function HomeModeHeaderControl({ mode }: { mode: HomeMode }) {
  return (
    <div className="inline-grid grid-cols-2 gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
      {[
        { value: "today" as const, label: "Сегодня" },
        { value: "week" as const, label: "Неделя" },
      ].map((item) => {
        const active = item.value === mode;

        return (
          <Link
            key={item.value}
            href={item.value === "today" ? "/" : "/?mode=week"}
            replace
            scroll={false}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active ? "bg-zinc-100 text-black" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
