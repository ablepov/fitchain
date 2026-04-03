interface MiniChartProps {
  reps: number[];
}

export function MiniChart({ reps }: MiniChartProps) {
  const height = 64;
  const pad = 8;

  if (reps.length === 0) {
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-2xl border border-zinc-900 bg-zinc-950">
        <span className="text-sm text-zinc-500">Нет данных для графика</span>
      </div>
    );
  }

  const max = Math.max(1, ...reps);
  const chartWidth = 100;
  const chartHeight = height - pad * 2;

  const points = reps.map((value, index) => {
    const x = pad + (index * (chartWidth - pad * 2)) / Math.max(1, reps.length - 1);
    const y = pad + chartHeight - (value / max) * chartHeight;

    return { x, y };
  });

  const pathData = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="h-16 w-full rounded-2xl border border-zinc-900 bg-black/80 p-2">
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${chartWidth} ${height}`}
        role="img"
        aria-label="График последних подходов"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={`areaGradient-${reps.length}-${reps[0]}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fafafa" stopOpacity={0.18} />
            <stop offset="100%" stopColor="#fafafa" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <line
          x1={pad}
          y1={pad + chartHeight / 2}
          x2={chartWidth - pad}
          y2={pad + chartHeight / 2}
          stroke="#27272a"
          strokeWidth="0.6"
        />

        <polygon
          points={`${pad},${pad + chartHeight} ${points.map((point) => `${point.x},${point.y}`).join(" ")} ${
            points[points.length - 1]?.x || chartWidth - pad
          },${pad + chartHeight}`}
          fill={`url(#areaGradient-${reps.length}-${reps[0]})`}
        />

        <path
          d={pathData}
          fill="none"
          stroke="#f4f4f5"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <circle
            key={`${point.x}-${point.y}-${index}`}
            cx={point.x}
            cy={point.y}
            r={index === points.length - 1 ? "2.2" : "1.5"}
            fill={index === points.length - 1 ? "#fafafa" : "#a1a1aa"}
          />
        ))}
      </svg>
    </div>
  );
}
