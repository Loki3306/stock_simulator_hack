export interface NodeData {
  id: string;
  type: 'stock' | 'option_leg' | 'entry' | 'exit' | 'strategy_block' | 'risk_reward' | 'execution' | string;
  blockType: string;
  position: { x: number; y: number };
  parameters?: Record<string, any>;
}

export default function Node({ data, selected, onMouseDown, onContext }: { data: NodeData; selected?: boolean; onMouseDown?: (e: React.MouseEvent) => void; onContext?: (e: React.MouseEvent) => void; }) {
  // small, non-invasive rendering: label and compact metadata with handles
  return (
    <div
      onMouseDown={onMouseDown}
      onContextMenu={(e) => { e.preventDefault(); onContext?.(e); }}
      className={`absolute rounded-lg border border-white/10 bg-card/80 px-3 py-2 shadow-sm hover:shadow-md select-none ${selected ? 'ring-2 ring-secondary' : ''}`}
      style={{ left: data.position.x, top: data.position.y, minWidth: 140 }}
    >
      {/* left input handle */}
      <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-muted rounded-full" />
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{data.type}</div>
      <div className="font-medium">{data.blockType || data.type}</div>
      {data.type === 'stock' && <div className="text-xs text-muted-foreground">{data.parameters?.symbol || 'Select ticker'}</div>}
      {data.type === 'option_leg' && <div className="text-xs text-muted-foreground">{data.parameters?.side || 'CE/PE'} {data.parameters?.strike || ''}</div>}
      {/* right output handle */}
      <div className="absolute right-[-8px] top-1/2 transform -translate-y-1/2 w-3 h-3 bg-accent rounded-full" />
    </div>
  );
}
