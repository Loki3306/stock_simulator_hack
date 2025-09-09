import { motion } from "framer-motion";

export interface NodeData {
  id: string;
  type: 'indicator' | 'condition' | 'action' | 'risk';
  blockType: string;
  position: { x: number; y: number };
  parameters?: Record<string, any>;
}

export default function Node({ data, selected, onMouseDown }: { data: NodeData; selected?: boolean; onMouseDown?: (e: React.MouseEvent) => void }) {
  const color = data.type === 'action' ? 'from-[#ffb347] to-[#ffa500]' : data.type === 'indicator' ? 'from-[#8E8FF7] to-[#6f70f2]' : 'from-white/10 to-white/0';
  return (
    <motion.div
      layout
      onMouseDown={onMouseDown}
      className={`absolute rounded-lg border border-white/10 bg-card/80 px-3 py-2 shadow-sm hover:shadow-md select-none ${selected ? 'ring-2 ring-secondary' : ''}`}
      style={{ left: data.position.x, top: data.position.y }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`text-[10px] uppercase tracking-wide text-muted-foreground`}>{data.type}</div>
      <div className={`font-medium bg-clip-text text-transparent bg-gradient-to-r ${color}`}>{data.blockType}</div>
    </motion.div>
  );
}
