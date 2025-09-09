import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

export interface ChartProps {
  data: { date: string; value: number }[];
  type: "line" | "area" | "candlestick";
  height?: number;
  showTooltips?: boolean;
  animated?: boolean;
}

const axisStyle = {
  stroke: "#6b7280",
  fontSize: 12,
} as const;

export default function ChartComponent({
  data,
  type,
  height = 160,
  showTooltips = true,
  animated = true,
}: ChartProps) {
  const common = (
    <>
      <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
      <XAxis
        dataKey="date"
        tickLine={false}
        axisLine={false}
        minTickGap={24}
        tick={{ fill: "#9ca3af", fontSize: 12 }}
      />
      <YAxis
        tickLine={false}
        axisLine={false}
        tick={{ fill: "#9ca3af", fontSize: 12 }}
        width={40}
      />
      {showTooltips && (
        <Tooltip
          contentStyle={{
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#e5e7eb" }}
          itemStyle={{ color: "#e5e7eb" }}
        />
      )}
    </>
  );

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer>
        {type === "area" ? (
          <AreaChart
            data={data}
            margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
          >
            {common}
            <defs>
              <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffb347" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#ffb347" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#ffa500"
              strokeWidth={2}
              fill="url(#fillPrimary)"
              isAnimationActive={animated}
            />
          </AreaChart>
        ) : (
          <LineChart
            data={data}
            margin={{ left: 8, right: 8, top: 8, bottom: 0 }}
          >
            {common}
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8E8FF7"
              strokeWidth={2}
              dot={false}
              isAnimationActive={animated}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
