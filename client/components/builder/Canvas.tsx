import { useCallback, useRef, useState } from "react";
import Node, { NodeData } from "./Node";

export interface Edge { from: string; to: string }

export default function Canvas({ nodes, edges, onUpdate }: { nodes: NodeData[]; edges: Edge[]; onUpdate: (n: NodeData[], e: Edge[]) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const z = Math.min(1.6, Math.max(0.6, zoom - e.deltaY * 0.001));
    setZoom(z);
  };

  const onMouseDownBG = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).dataset.role === 'bg') {
      setSelected(null);
    }
  };

  const startDrag = (id: string) => (e: React.MouseEvent) => {
    const n = nodes.find((x) => x.id === id)!;
    dragging.current = { id, dx: e.clientX - n.position.x, dy: e.clientY - n.position.y };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (dragging.current) {
      const { id, dx, dy } = dragging.current;
      const next = nodes.map((n) => n.id === id ? { ...n, position: { x: e.clientX - dx, y: e.clientY - dy } } : n);
      onUpdate(next, edges);
    }
  };
  const onMouseUp = () => { dragging.current = null; };

  const startConnect = useCallback((id: string) => {
    if (!connectFrom) { setConnectFrom(id); }
    else if (connectFrom && connectFrom !== id) {
      const exists = edges.some((e) => e.from === connectFrom && e.to === id);
      if (!exists) onUpdate(nodes, [...edges, { from: connectFrom, to: id }]);
      setConnectFrom(null);
    } else setConnectFrom(null);
  }, [connectFrom, edges, nodes, onUpdate]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border/60 bg-[radial-gradient(circle_at_25%_15%,rgba(142,143,247,0.08),transparent_40%),radial-gradient(circle_at_75%_65%,rgba(255,170,34,0.06),transparent_40%)]">
      <div
        data-role="bg"
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, transformOrigin: '0 0' }}
        onWheel={onWheel}
        onMouseDown={onMouseDownBG}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      >
        <svg className="absolute inset-0 w-[2000px] h-[1200px]">
          {edges.map((e, idx) => {
            const a = nodes.find((n) => n.id === e.from);
            const b = nodes.find((n) => n.id === e.to);
            if (!a || !b) return null;
            const x1 = a.position.x + 80, y1 = a.position.y + 24;
            const x2 = b.position.x, y2 = b.position.y + 24;
            const cx = (x1 + x2) / 2;
            const d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`;
            return <path key={idx} d={d} stroke="#8E8FF7" strokeOpacity={0.6} strokeWidth={2} fill="none" />;
          })}
        </svg>
        {nodes.map((n) => (
          <div key={n.id} onDoubleClick={() => startConnect(n.id)} onClick={() => setSelected(n.id)}>
            <Node data={n} selected={n.id === selected || n.id === connectFrom} onMouseDown={startDrag(n.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
