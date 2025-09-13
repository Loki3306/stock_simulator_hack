import { useEffect, useMemo, useState } from "react";
import Palette from "@/components/builder/Palette";
import Canvas from "@/components/builder/Canvas";
import Inspector from "@/components/builder/Inspector";
import type { NodeData } from "@/components/builder/Node";
import { motion } from "framer-motion";
import { repo, Strategy } from "@/lib/mockRepo";

export default function Builder() {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<{ from: string; to: string }[]>([]);
  const [title, setTitle] = useState("Untitled Strategy");
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const s = repo.listStrategies(repo.user().id)[0];
    if (s) {
      setTitle(s.title);
      setNodes(s.nodes);
      setEdges(s.edges);
    }
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selected) || null,
    [nodes, selected],
  );

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    const data = JSON.parse(e.dataTransfer.getData("text/plain") || "{}");
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const id = `n_${Math.random().toString(36).slice(2, 8)}`;
    const type = inferType(data.blockType);
    const node: NodeData = {
      id,
      type,
      blockType: data.blockType,
      position: { x: e.clientX - rect.left - 50, y: e.clientY - rect.top - 20 },
      parameters: {},
    };
    setNodes([...nodes, node]);
  };

  const onUpdate = (n: NodeData[], e: { from: string; to: string }[]) => {
    setNodes(n);
    setEdges(e);
  };

  function inferType(block: string): NodeData["type"] {
    if (["BUY", "SELL", "BUY_LIMIT", "SELL_LIMIT"].includes(block))
      return "action";
    if (["GreaterThan", "LessThan", "Crossover", "AND", "OR"].includes(block))
      return "condition";
    if (
      ["StopLoss", "TakeProfit", "PositionSize", "MaxDrawdown"].includes(block)
    )
      return "risk";
    return "indicator";
  }

  function save() {
    repo.saveStrategy({ title, nodes, edges });
  }

  function applyChange(n: Partial<NodeData>) {
    if (!selectedNode) return;
    setNodes(
      nodes.map((x) =>
        x.id === selectedNode.id
          ? {
              ...x,
              ...n,
              parameters: { ...x.parameters, ...(n as any).parameters },
            }
          : x,
      ),
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] mx-auto">
      {/* Top action buttons row with spacing */}
      <div className="flex flex-wrap items-center gap-4 py-2 mb-2">
        <button className="bg-green-500 text-white px-4 py-2 rounded">Add Test Node</button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded">Backtest</button>
        <button className="bg-gray-700 text-white px-4 py-2 rounded">Export</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Import</button>
        <button className="bg-purple-400 text-white px-4 py-2 rounded">Load Template</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Load Working Strategy</button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        <button className="bg-red-600 text-white px-4 py-2 rounded">Clear</button>
        <button className="bg-blue-400 text-white px-4 py-2 rounded">Hide Analytics</button>
      </div>

      {/* Title and Save button row */}
      <div className="flex items-center gap-3 mb-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-md bg-card/60 border border-border/60 px-3 py-2 font-display text-lg"
        />
        <button
          onClick={save}
          className="px-4 py-2 rounded-md btn-gradient text-black font-medium"
        >
          Save
        </button>
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4 min-h-[70vh]">
        <div className="col-span-3 rounded-xl border border-border/60 bg-card/60">
          <Palette />
        </div>
        <div
          className="col-span-6 rounded-xl border border-border/60 bg-card/60"
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => setSelected(null)}
        >
          <Canvas nodes={nodes} edges={edges} onUpdate={onUpdate} />
        </div>
        <div className="col-span-3 rounded-xl border border-border/60 bg-card/60">
          <Inspector selected={selectedNode} onChange={applyChange} />
        </div>
      </div>
    </div>
  );
}
