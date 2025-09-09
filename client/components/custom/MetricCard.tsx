import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  title: string;
  value: number;
  change?: number;
  format: "currency" | "percentage" | "number";
  trend?: "up" | "down" | "neutral";
  className?: string;
}

function formatValue(val: number, fmt: MetricCardProps["format"]) {
  switch (fmt) {
    case "currency":
      return val.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });
    case "percentage":
      return `${val.toFixed(1)}%`;
    default:
      return val.toLocaleString();
  }
}

export default function MetricCard({
  title,
  value,
  change,
  format,
  trend = "neutral",
  className,
}: MetricCardProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = null;

    const duration = 700;
    const step = (ts: number) => {
      if (startRef.current == null) startRef.current = ts;
      const p = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(fromRef.current + (value - fromRef.current) * eased);
      if (p < 1) requestAnimationFrame(step);
    };

    const id = requestAnimationFrame(step);
    return () => cancelAnimationFrame(id);
  }, [value]);

  const changeColor =
    change == null
      ? "text-muted-foreground"
      : change >= 0
        ? "text-success"
        : "text-destructive";

  return (
    <div
      className={cn(
        "relative rounded-xl border border-border/60 bg-card/60 bg-card-gradient p-4 shadow-sm hover:shadow-md transition",
        className,
      )}
    >
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {title}
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="font-display text-2xl font-semibold">
          {formatValue(display, format)}
        </div>
        {change != null && (
          <div className={cn("text-sm font-medium", changeColor)}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(1)}%
          </div>
        )}
      </div>
      <div className="absolute inset-0 rounded-xl pointer-events-none ring-1 ring-white/5" />
      {trend !== "neutral" && (
        <div
          className={cn(
            "absolute -inset-px rounded-xl",
            trend === "up"
              ? "shadow-[0_0_24px_rgba(0,214,122,0.25)]"
              : "shadow-[0_0_24px_rgba(255,60,60,0.2)]",
          )}
        />
      )}
    </div>
  );
}
