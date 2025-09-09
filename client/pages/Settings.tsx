import { useEffect, useState } from "react";

export default function Settings() {
  const [reduceMotion, setReduceMotion] = useState<boolean>(() => localStorage.getItem('reduce_motion') === '1');
  useEffect(() => {
    localStorage.setItem('reduce_motion', reduceMotion ? '1' : '0');
    document.body.dataset.reduceMotion = reduceMotion ? '1' : '0';
  }, [reduceMotion]);
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl">Settings</h1>
      <div className="mt-6 rounded-xl border border-border/60 bg-card/60 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Reduce Motion</div>
            <div className="text-sm text-muted-foreground">Disable heavy animations for accessibility and performance.</div>
          </div>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
            <span className="text-sm">{reduceMotion ? 'On' : 'Off'}</span>
          </label>
        </div>
      </div>
    </div>
  );
}
