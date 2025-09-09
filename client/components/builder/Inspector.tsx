import { NodeData } from "./Node";

export default function Inspector({
  selected,
  onChange,
}: {
  selected: NodeData | null;
  onChange: (n: Partial<NodeData>) => void;
}) {
  if (!selected)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Select a node to edit properties.
      </div>
    );
  const params = selected.parameters || {};
  return (
    <div className="p-4 space-y-3">
      <div>
        <label className="text-xs text-muted-foreground">Label</label>
        <input
          className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm"
          value={selected.blockType}
          onChange={(e) => onChange({ blockType: e.target.value })}
        />
      </div>
      {selected.type === "indicator" && (
        <div>
          <label className="text-xs text-muted-foreground">Period</label>
          <input
            type="range"
            min={2}
            max={50}
            value={params.period ?? 14}
            onChange={(e) =>
              onChange({
                parameters: { ...params, period: Number(e.target.value) },
              })
            }
            className="w-full"
          />
          <div className="text-xs text-muted-foreground">
            {params.period ?? 14}
          </div>
        </div>
      )}
      {selected.type === "condition" && (
        <div>
          <label className="text-xs text-muted-foreground">Threshold</label>
          <input
            type="number"
            className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm"
            value={params.threshold ?? 30}
            onChange={(e) =>
              onChange({
                parameters: { ...params, threshold: Number(e.target.value) },
              })
            }
          />
        </div>
      )}
    </div>
  );
}
