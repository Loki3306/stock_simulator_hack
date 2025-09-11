import { MouseEvent } from "react";

export default function ContextMenu({ x, y, onAction }: { x: number; y: number; onAction: (a: string) => void; }) {
  return (
    <div style={{ left: x, top: y }} className="absolute z-50 bg-card border border-border/60 rounded shadow-md py-1">
      <div className="px-3 py-2 text-sm hover:bg-muted cursor-pointer" onClick={() => onAction('edit')}>Edit</div>
      <div className="px-3 py-2 text-sm hover:bg-muted cursor-pointer" onClick={() => onAction('duplicate')}>Duplicate</div>
      <div className="px-3 py-2 text-sm text-destructive hover:bg-muted cursor-pointer" onClick={() => onAction('delete')}>Delete</div>
    </div>
  );
}
