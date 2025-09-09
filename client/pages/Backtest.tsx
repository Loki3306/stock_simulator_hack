import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { repo } from "@/lib/mockRepo";
import ChartComponent from "@/components/custom/ChartComponent";

export default function Backtest() {
  const { id } = useParams();
  const [jobId, setJobId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    let j = id as string;
    if (!j || j === "mock") {
      const s = repo.listStrategies()[0];
      j = repo.enqueueBacktest(s.id);
    }
    setJobId(j);
  }, [id]);

  useEffect(() => {
    if (!jobId) return;
    const t = setInterval(() => {
      const job = repo.getJob(jobId);
      if (!job) return;
      setProgress(job.progress);
      if (job.status === "completed" && job.result) {
        setResult(job.result);
        clearInterval(t);
      }
    }, 500);
    return () => clearInterval(t);
  }, [jobId]);

  const equity = useMemo(() => result?.equityCurve || [], [result]);
  const drawdown = useMemo(() => result?.drawdownCurve || [], [result]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Backtest Results</h1>
        <div className="text-sm text-muted-foreground">
          Progress: {progress}%
        </div>
      </div>

      {result ? (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <KPI title="Total Return" value={`${result.kpis.totalReturn}%`} />
            <KPI title="Annualized" value={`${result.kpis.annualReturn}%`} />
            <KPI title="Sharpe" value={`${result.kpis.sharpe}`} />
            <KPI title="Max DD" value={`${result.kpis.maxDrawdown}%`} />
            <KPI title="Win Rate" value={`${result.kpis.winRate}%`} />
            <KPI title="Trades" value={`${result.trades.length}`} />
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card/60 p-5">
              <h2 className="font-display">Equity Curve</h2>
              <ChartComponent type="area" data={equity} height={240} />
            </div>
            <div className="rounded-xl border border-border/60 bg-card/60 p-5">
              <h2 className="font-display">Drawdown</h2>
              <ChartComponent
                type="line"
                data={drawdown.map((d: any) => ({
                  date: d.date,
                  value: d.drawdown,
                }))}
                height={240}
              />
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-border/60 bg-card/60 p-5 overflow-auto">
            <h2 className="font-display mb-3">Trades</h2>
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Action</th>
                  <th className="text-left p-2">Qty</th>
                  <th className="text-left p-2">Price</th>
                  <th className="text-left p-2">P&L</th>
                </tr>
              </thead>
              <tbody>
                {result.trades.map((t: any) => (
                  <tr key={t.id} className="border-t border-border/60">
                    <td className="p-2">{t.id}</td>
                    <td className="p-2">{t.date}</td>
                    <td className="p-2">{t.action}</td>
                    <td className="p-2">{t.qty}</td>
                    <td className="p-2">{t.price}</td>
                    <td
                      className={`p-2 ${t.pnl >= 0 ? "text-success" : "text-destructive"}`}
                    >
                      {t.pnl.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-xl border border-border/60 bg-card/60 p-8 text-center">
          <div className="text-muted-foreground">
            Running backtest... {progress}%
          </div>
          <div className="mt-3 h-2 w-full bg-white/5 rounded">
            <div
              className="h-2 rounded btn-gradient"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function KPI({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card-gradient p-4">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="font-display text-xl">{value}</div>
    </div>
  );
}
