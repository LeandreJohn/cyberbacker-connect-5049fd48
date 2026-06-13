import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-popover)",
    border: "1px solid var(--color-border)",
    borderRadius: 10,
    color: "var(--color-popover-foreground)",
    fontSize: 12,
  },
  labelStyle: { color: "var(--color-muted-foreground)" },
};

// Recharts needs the DOM; render only after mount to avoid SSR mismatch.
function ChartShell({ children, height = 280 }: { children: React.ReactElement; height?: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ height }} />;
  return (
    <ResponsiveContainer width="100%" height={height}>
      {children}
    </ResponsiveContainer>
  );
}


export function TrendAreaChart({
  data,
  xKey,
  series,
  height,
}: {
  data: any[];
  xKey: string;
  series: { key: string; color: string; label: string }[];
  height?: number;
}) {
  return (
    <ChartShell height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            fill={`url(#grad-${s.key})`}
          />
        ))}
      </AreaChart>
    </ChartShell>
  );
}

export function GroupedBarChart({
  data,
  xKey,
  series,
  height,
}: {
  data: any[];
  xKey: string;
  series: { key: string; color: string; label: string }[];
  height?: number;
}) {
  return (
    <ChartShell height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--color-muted)", opacity: 0.4 }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[6, 6, 0, 0]} />
        ))}
      </BarChart>
    </ChartShell>
  );
}

export function SimpleLineChart({
  data,
  xKey,
  series,
  height,
}: {
  data: any[];
  xKey: string;
  series: { key: string; color: string; label: string }[];
  height?: number;
}) {
  return (
    <ChartShell height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tooltipStyle} />
        {series.map((s) => (
          <Line
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.label}
            stroke={s.color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartShell>
  );
}

export function DonutChart({
  data,
  height = 280,
}: {
  data: any[];
  height?: number;
}) {
  return (
    <ChartShell height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius="58%"
          outerRadius="85%"
          paddingAngle={2}
          stroke="var(--color-card)"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} />
      </PieChart>
    </ChartShell>
  );
}

export const chartColors = {
  1: "var(--color-chart-1)",
  2: "var(--color-chart-2)",
  3: "var(--color-chart-3)",
  4: "var(--color-chart-4)",
  5: "var(--color-chart-5)",
};
