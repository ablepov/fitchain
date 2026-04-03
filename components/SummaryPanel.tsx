import type { SummaryItem } from "@/lib/trainingData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SummaryPanelProps {
  timezone: string;
  summary: SummaryItem[];
  total: number;
}

export function SummaryPanel({ timezone, summary, total }: SummaryPanelProps) {
  return (
    <Card aria-labelledby="summary-heading" className="overflow-hidden">
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle id="summary-heading">Сводка за сегодня</CardTitle>
            <p className="mt-1 text-sm text-zinc-500">Дневной объём по всем упражнениям</p>
          </div>
          <Badge aria-label="Часовой пояс">{timezone}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-zinc-900 bg-black p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Итого</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-50">{total}</div>
          </div>
          <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-3">
            <div className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">Упражнений</div>
            <div className="mt-2 text-2xl font-semibold text-zinc-50">{summary.length}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Separator />
        <ul className="space-y-2 text-sm">
          {summary.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-zinc-900 bg-black/60 px-3 py-4 text-center text-zinc-500">
              Пока нет активности за сегодня
            </li>
          ) : (
            summary.map((item) => (
              <li
                key={item.type}
                className="flex items-center justify-between rounded-2xl border border-zinc-900 bg-black/70 px-3 py-3"
              >
                <span className="capitalize text-zinc-300">{item.type}</span>
                <span className="font-semibold text-zinc-50">{item.total}</span>
              </li>
            ))
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
