import { useParams } from "react-router-dom";

export default function Backtest() {
  const { id } = useParams();
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="font-display text-3xl">Backtest Results</h1>
      <p className="mt-2 text-muted-foreground">Job ID: {id}</p>
      <div className="mt-8 rounded-xl border border-border/60 bg-card/60 p-8 text-sm text-muted-foreground">
        Placeholder: Equity curve, drawdown, and trade table coming next.
      </div>
    </div>
  );
}
