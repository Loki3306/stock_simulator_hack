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
      {/* Domain-specific editors */}
      {selected.type === 'stock' && (
        <div>
          <label className="text-xs text-muted-foreground">Ticker</label>
          <input className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.symbol || ''} onChange={(e) => onChange({ parameters: { ...params, symbol: e.target.value } })} />
          <label className="text-xs text-muted-foreground">Lot Size</label>
          <input type="number" className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.lot || 1} onChange={(e) => onChange({ parameters: { ...params, lot: Number(e.target.value) } })} />
        </div>
      )}
      {selected.type === 'option_leg' && (
        <div>
          <label className="text-xs text-muted-foreground">Side</label>
          <select className="w-full mt-1 rounded bg-card/60 border border-border/60" value={params.side || 'CE'} onChange={(e) => onChange({ parameters: { ...params, side: e.target.value } })}>
            <option value="CE">Call (CE)</option>
            <option value="PE">Put (PE)</option>
          </select>
          <label className="text-xs text-muted-foreground">Buy / Sell</label>
          <select className="w-full mt-1 rounded bg-card/60 border border-border/60" value={params.action || 'BUY'} onChange={(e) => onChange({ parameters: { ...params, action: e.target.value } })}>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
          </select>
          <label className="text-xs text-muted-foreground">Strike</label>
          <input type="number" className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.strike || ''} onChange={(e) => onChange({ parameters: { ...params, strike: Number(e.target.value) } })} />
          <label className="text-xs text-muted-foreground">Expiry</label>
          <input type="date" className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.expiry || ''} onChange={(e) => onChange({ parameters: { ...params, expiry: e.target.value } })} />
          <label className="text-xs text-muted-foreground">Quantity (lots)</label>
          <input type="number" className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.qty || 1} onChange={(e) => onChange({ parameters: { ...params, qty: Number(e.target.value) } })} />
        </div>
      )}
      {selected.type === 'entry' && (
        <div>
          <label className="text-xs text-muted-foreground">Trigger Type</label>
          <select className="w-full mt-1 rounded bg-card/60 border border-border/60" value={params.trigger || 'Price'} onChange={(e) => onChange({ parameters: { ...params, trigger: e.target.value } })}>
            <option>Price</option>
            <option>Indicator</option>
            <option>Time</option>
          </select>
          <label className="text-xs text-muted-foreground">Condition (e.g., Spot &gt; 18000)</label>
          <input className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.expr || ''} onChange={(e) => onChange({ parameters: { ...params, expr: e.target.value } })} />
        </div>
      )}
      {selected.type === 'exit' && (
        <div>
          <label className="text-xs text-muted-foreground">Target %</label>
          <input type="number" className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.target ?? ''} onChange={(e) => onChange({ parameters: { ...params, target: Number(e.target.value) } })} />
          <label className="text-xs text-muted-foreground">Stop Loss %</label>
          <input type="number" className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.stop ?? ''} onChange={(e) => onChange({ parameters: { ...params, stop: Number(e.target.value) } })} />
        </div>
      )}
      {selected.type === 'strategy_block' && (
        <div>
          <label className="text-xs text-muted-foreground">Template Type</label>
          <select className="w-full mt-1 rounded bg-card/60 border border-border/60" value={params.template || 'Straddle'} onChange={(e) => onChange({ parameters: { ...params, template: e.target.value } })}>
            <option>Straddle</option>
            <option>Strangle</option>
            <option>Iron Condor</option>
            <option>Butterfly</option>
          </select>
        </div>
      )}
      {selected.type === 'risk_reward' && (
        <div>
          <label className="text-xs text-muted-foreground">Capital</label>
          <input type="number" className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.capital || 0} onChange={(e) => onChange({ parameters: { ...params, capital: Number(e.target.value) } })} />
        </div>
      )}
      {selected.type === 'execution' && (
        <div>
          <label className="text-xs text-muted-foreground">Broker</label>
          <input className="mt-1 w-full rounded-md bg-card/60 border border-border/60 px-3 py-2 text-sm" value={params.broker || ''} onChange={(e) => onChange({ parameters: { ...params, broker: e.target.value } })} />
        </div>
      )}
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
