import { useMemo } from "react";

const NODE_CATEGORIES = {
  Stock: [
    { id: "stock", label: "Stock Selector" },
  ],
  Options: [
    { id: "option_leg", label: "Option Leg" },
    { id: "strategy_block", label: "Strategy Block" },
  ],
  Conditions: [
    { id: "entry", label: "Entry Condition" },
    { id: "exit", label: "Exit Condition" },
  ],
  Risk: [
    { id: "risk_reward", label: "Risk/Reward Calculator" },
  ],
  Execution: [
    { id: "execution", label: "Execution Node" },
  ],
};

export default function Palette() {
  const cats = useMemo(() => NODE_CATEGORIES, []);
  return (
    <div className="p-3 space-y-4">
      {Object.entries(cats).map(([cat, arr]) => (
        <div key={cat}>
          <div className="text-xs uppercase text-muted-foreground mb-2">{cat}</div>
          <div className="grid gap-2">
            {arr.map((b) => (
              <div
                key={b.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", JSON.stringify({ blockType: b.id }))}
                className="cursor-grab active:cursor-grabbing rounded-md border border-border/60 bg-card/60 px-3 py-2 text-sm hover:shadow-md"
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
