import { useMemo } from "react";

const CATS = {
  Indicators: ["RSI", "SMA", "EMA", "MACD", "Bollinger"],
  Conditions: ["GreaterThan", "LessThan", "Crossover", "AND", "OR"],
  Actions: ["BUY", "SELL", "BUY_LIMIT", "SELL_LIMIT"],
  Risk: ["StopLoss", "TakeProfit", "PositionSize", "MaxDrawdown"],
};

export default function Palette() {
  const items = useMemo(() => CATS, []);
  return (
    <div className="p-3 space-y-4">
      {Object.entries(items).map(([cat, arr]) => (
        <div key={cat}>
          <div className="text-xs uppercase text-muted-foreground mb-2">
            {cat}
          </div>
          <div className="grid gap-2">
            {arr.map((b) => (
              <div
                key={b}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "text/plain",
                    JSON.stringify({ blockType: b }),
                  )
                }
                className="cursor-grab active:cursor-grabbing rounded-md border border-border/60 bg-card-gradient px-3 py-2 text-sm hover:shadow-md"
              >
                {b}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
