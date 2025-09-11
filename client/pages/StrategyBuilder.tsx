import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Palette from "../components/builder/Palette";
import Canvas, { Edge } from "../components/builder/Canvas";
import Node, { NodeData } from "../components/builder/Node";
import Inspector from "../components/builder/Inspector";
// lightweight id generator to avoid extra deps
const genId = (() => {
  let i = 1;
  return () => {
    i += 1;
    return `n_${Date.now().toString(36)}_${i}`;
  };
})();
import { AnimatePresence, motion } from "framer-motion";
import ContextMenu from "../components/builder/ContextMenu";

function useUndoable<T>(initial: T) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState<T>(initial);
  const [future, setFuture] = useState<T[]>([]);
  const set = (v: T) => {
    setPast((p) => [...p, present]);
    setPresent(v);
    setFuture([]);
  };
  const undo = () => {
    if (!past.length) return;
    const prev = past[past.length - 1];
    setPast((p) => p.slice(0, -1));
    setFuture((f) => [present, ...f]);
    setPresent(prev);
  };
  const redo = () => {
    if (!future.length) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, present]);
    setPresent(next);
  };
  return { present, set, undo, redo, canUndo: past.length > 0, canRedo: future.length > 0 };
}

export default function StrategyBuilder() {
  const initial = { nodes: [] as NodeData[], edges: [] as Edge[] };
  const state = useUndoable(initial);
  const { present, set, undo, redo } = state;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [context, setContext] = useState<{ x: number; y: number; id: string } | null>(null);
  const [selectedEdgeIdx, setSelectedEdgeIdx] = useState<number | null>(null);
  const [multiSelect, setMultiSelect] = useState<string[]>([]);
  const clipboard = useRef<NodeData[] | null>(null);

  const onUpdate = (nodes: NodeData[], edges: Edge[]) => {
    set({ nodes, edges });
  };

  const onDrop = useCallback((data: any, pos: { x: number; y: number }) => {
    const id = genId();
    const n: NodeData = {
      id,
      type: data.blockType || data.type || "stock",
      blockType: data.label || data.blockType || data.type || "",
      position: { x: pos.x, y: pos.y },
      parameters: {},
    };
    set({ nodes: [...present.nodes, n], edges: present.edges });
  }, [present, set]);

  // keyboard handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        // prefer node deletion if a node is selected
        if (selectedId) {
          const nodes = present.nodes.filter((n) => n.id !== selectedId);
          const edges = present.edges.filter((e2) => e2.from !== selectedId && e2.to !== selectedId);
          set({ nodes, edges });
          setSelectedId(null);
          return;
        }
        // delete selected edge if any
        if (selectedEdgeIdx !== null) {
          const edges = present.edges.filter((_, i) => i !== selectedEdgeIdx);
          set({ nodes: present.nodes, edges });
          setSelectedEdgeIdx(null);
          return;
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "z") undo();
      if ((e.ctrlKey || e.metaKey) && e.key === "y") redo();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        // copy selected nodes
        if (multiSelect.length) {
          clipboard.current = present.nodes.filter((n) => multiSelect.includes(n.id));
        } else if (selectedId) {
          clipboard.current = present.nodes.filter((n) => n.id === selectedId);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "v") {
        if (!clipboard.current) return;
        const copies = clipboard.current.map((c) => ({ ...c, id: genId(), position: { x: c.position.x + 20, y: c.position.y + 20 } }));
        set({ nodes: [...present.nodes, ...copies], edges: present.edges });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [present, selectedId, set, undo, redo]);

  // capture last mouse event to detect modifier keys for selection
  useEffect(() => {
    const onDown = (e: MouseEvent) => { (window as any)._lastMouseEvent = e; };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, []);

  const onNodeChange = useCallback((id: string, patch: Partial<NodeData>) => {
    const nodes = present.nodes.map((n) => (n.id === id ? { ...n, ...patch } : n));
    set({ nodes, edges: present.edges });
  }, [present, set]);

  const handleContextAction = (action: string) => {
    if (!context) return setContext(null);
    const id = context.id;
    // handle edge context (id like 'edge:IDX')
    if (id.startsWith("edge:")) {
      const idx = Number(id.split(":")[1]);
      if (action === "delete") {
        const edges = present.edges.filter((_, i) => i !== idx);
        set({ nodes: present.nodes, edges });
        setSelectedEdgeIdx(null);
      }
      if (action === "duplicate") {
        const edge = present.edges[idx];
        if (edge) set({ nodes: present.nodes, edges: [...present.edges, { ...edge }] });
      }
      if (action === "edit") {
        setSelectedEdgeIdx(idx);
      }
      setContext(null);
      return;
    }

    if (action === "delete") {
      const nodes = present.nodes.filter((n) => n.id !== id);
      const edges = present.edges.filter((e) => e.from !== id && e.to !== id);
      set({ nodes, edges });
      setSelectedId(null);
    }
    if (action === "duplicate") {
      const orig = present.nodes.find((n) => n.id === id);
      if (!orig) return;
      const copy = { ...orig, id: genId(), position: { x: orig.position.x + 20, y: orig.position.y + 20 } };
      set({ nodes: [...present.nodes, copy], edges: present.edges });
    }
    if (action === "edit") {
      setSelectedId(id);
    }
    setContext(null);
  };

  // compute simple payoff if option legs present (approximate)
  const payoff = useMemo(() => {
    const legs = present.nodes.filter((n) => n.type === "option_leg");
    if (!legs.length) return null;
    // crude payoff: sum of leg intrinsic values at spot range
    const strikes = legs.map((l) => l.parameters?.strike || 0);
    const min = Math.max(0, Math.min(...strikes) - 2000);
    const max = Math.max(...strikes) + 2000;
    const points = [] as { spot: number; pnl: number }[];
    for (let s = min; s <= max; s += (max - min) / 80) {
      let pnl = 0;
      for (const l of legs) {
        const strike = Number(l.parameters?.strike || 0);
        const qty = Number(l.parameters?.qty || 1);
        const side = (l.parameters?.action || "BUY").toUpperCase();
        const type = (l.parameters?.side || "CE").toUpperCase();
        if (type === "CE") {
          const intrinsic = Math.max(0, s - strike);
          pnl += (side === "BUY" ? -1 : 1) * intrinsic * qty * 1;
        } else {
          const intrinsic = Math.max(0, strike - s);
          pnl += (side === "BUY" ? -1 : 1) * intrinsic * qty * 1;
        }
      }
      points.push({ spot: s, pnl });
    }
    return points;
  }, [present.nodes]);

  // compute metrics for payoff: breakevens, max profit/loss, approximate PoP
  const payoffMetrics = useMemo(() => {
    if (!payoff || !payoff.length) return null;
    const pnls = payoff.map((p) => p.pnl);
    const maxProfit = Math.max(...pnls);
    const maxLoss = Math.min(...pnls);
    // breakevens: spots where pnl crosses zero
    const breakevens: number[] = [];
    for (let i = 1; i < payoff.length; i++) {
      if (payoff[i - 1].pnl === 0) breakevens.push(payoff[i - 1].spot);
      if ((payoff[i - 1].pnl < 0 && payoff[i].pnl > 0) || (payoff[i - 1].pnl > 0 && payoff[i].pnl < 0)) {
        // linear interp
        const t = Math.abs(payoff[i - 1].pnl) / (Math.abs(payoff[i - 1].pnl) + Math.abs(payoff[i].pnl));
        const spot = payoff[i - 1].spot + t * (payoff[i].spot - payoff[i - 1].spot);
        breakevens.push(spot);
      }
    }
    // approximate PoP: fraction of spots with positive pnl (naive)
    const pop = pnls.filter((v) => v > 0).length / pnls.length;
    return { maxProfit, maxLoss, breakevens, pop };
  }, [payoff]);

  return (
    <div className="h-full grid grid-cols-[260px_1fr_360px] grid-rows-[56px_1fr_260px] gap-4 p-4">
      <div className="col-span-3 row-start-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => { undo(); }}>Undo</button>
          <button className="btn" onClick={() => { redo(); }}>Redo</button>
          <button className="btn" onClick={() => { set({ nodes: [], edges: [] }); }}>Reset</button>
          <button className="btn" onClick={() => { alert('Save not implemented in this prototype'); }}>Save</button>
        </div>
        <div className="text-sm text-muted-foreground">Strategy Builder</div>
      </div>

      <div className="col-start-1 row-start-2 overflow-auto rounded-lg border border-border/60 bg-card/50">
        <Palette />
      </div>

  <div className="col-start-2 row-start-2 relative">
        <div
          onDrop={(e) => {
            e.preventDefault();
            const dt = e.dataTransfer.getData("text/plain");
            try {
              const parsed = JSON.parse(dt);
              const rect = (e.target as HTMLElement).getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
    onDrop(parsed, { x, y });
            } catch (err) {}
          }}
          onDragOver={(e) => e.preventDefault()}
          className="h-full"
        >
          <div className="relative h-full w-full">
            <Canvas
              nodes={present.nodes}
              edges={present.edges}
              onUpdate={onUpdate}
              onSelectNode={(id) => {
                // id may be null
                const lastEvent = (window as any)._lastMouseEvent as MouseEvent | undefined;
                const isMulti = lastEvent ? (lastEvent.shiftKey || lastEvent.ctrlKey || lastEvent.metaKey) : false;
                if (!id) {
                  setSelectedId(null);
                  setMultiSelect([]);
                  return;
                }
                if (isMulti) {
                  setMultiSelect((m) => (m.includes(id) ? m.filter((x) => x !== id) : [...m, id]));
                  setSelectedId(id);
                } else {
                  setSelectedId(id);
                  setMultiSelect([id]);
                }
              }}
              onNodeContext={(info) => {
                // info.id may be 'edge:IDX' for edges
                setContext({ x: info.x, y: info.y, id: info.id });
              }}
              onSelectEdge={(idx) => setSelectedEdgeIdx(idx)}
              selectedEdgeIdx={selectedEdgeIdx}
              multiSelect={multiSelect}
              onMultiMove={(dx, dy) => {
                // not used — Canvas handles movement and calls onUpdate directly
              }}
            />
            {context && (
              <ContextMenu x={context.x} y={context.y} onAction={handleContextAction} />
            )}
          </div>
        </div>
      </div>

      <div className="col-start-3 row-start-2 overflow-auto rounded-lg border border-border/60 bg-card/50">
        <Inspector
          selected={present.nodes.find((n) => n.id === selectedId) || null}
          onChange={(patch) => {
            if (!selectedId) return;
            onNodeChange(selectedId, patch as Partial<NodeData>);
          }}
        />
      </div>

      <div className="col-span-3 row-start-3 rounded-lg border border-border/60 bg-card/60 p-3">
        <div className="flex items-center justify-between">
          <div className="font-medium">Payoff Preview</div>
          <div className="text-sm text-muted-foreground">Approximate</div>
        </div>
        <div className="mt-3 h-56 grid grid-cols-3 gap-4">
          <div className="col-span-2 h-56 relative">
            {payoff ? (
              <svg className="w-full h-full">
                {/* axes */}
                <line x1={40} y1={8} x2={40} y2={200} stroke="#444" strokeWidth={1} />
                <line x1={40} y1={200} x2={520} y2={200} stroke="#444" strokeWidth={1} />
                <polyline
                  fill="none"
                  stroke="#8E8FF7"
                  strokeWidth={2}
                  points={(() => {
                    const left = payoff[0].spot;
                    const right = payoff[payoff.length - 1].spot;
                    const pnls = payoff.map((p) => p.pnl);
                    const minP = Math.min(...pnls);
                    const maxP = Math.max(...pnls);
                    return payoff
                      .map((p) => {
                        const x = 40 + ((p.spot - left) / (right - left)) * 480;
                        const y = 200 - ((p.pnl - minP) / (maxP - minP || 1)) * 180;
                        return `${x},${y}`;
                      })
                      .join(" ");
                  })()}
                />
              </svg>
            ) : (
              <div className="text-sm text-muted-foreground">Add option legs to view payoff.</div>
            )}
          </div>

          <div className="col-span-1 p-2">
            <div className="text-xs text-muted-foreground">Max Profit</div>
            <div className="font-medium">{payoffMetrics ? payoffMetrics.maxProfit.toFixed(2) : "-"}</div>
            <div className="text-xs text-muted-foreground mt-2">Max Loss</div>
            <div className="font-medium">{payoffMetrics ? payoffMetrics.maxLoss.toFixed(2) : "-"}</div>
            <div className="text-xs text-muted-foreground mt-2">Breakevens</div>
            <div className="font-medium">{payoffMetrics ? payoffMetrics.breakevens.map((b) => Math.round(b)).join(', ') : '-'}</div>
            <div className="text-xs text-muted-foreground mt-2">Probability of Profit</div>
            <div className="font-medium">{payoffMetrics ? (payoffMetrics.pop * 100).toFixed(0) + '%' : '-'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
