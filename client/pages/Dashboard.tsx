import { useMemo } from "react";
import MetricCard from "@/components/custom/MetricCard";
import ChartComponent from "@/components/custom/ChartComponent";
import { Bell, Search, User } from "lucide-react";

function genSeries(len = 30, base = 100, vol = 2) {
  const out: { date: string; value: number }[] = [];
  let v = base;
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.5) * vol;
    out.push({ date: `D${i + 1}`, value: Math.max(0, Math.round(v * 100) / 100) });
  }
  return out;
}

export default function Dashboard() {
  const market = useMemo(() => ({
    SPY: genSeries(40, 450, 2),
    QQQ: genSeries(40, 380, 2.4),
    BTC: genSeries(40, 69000, 250),
  }), []);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Welcome back</h1>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 rounded-lg bg-card/60 border border-border/60 px-3 h-10 w-64">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input className="bg-transparent outline-none text-sm w-full placeholder:text-muted-foreground" placeholder="Search" />
          </div>
          <button className="relative p-2 rounded-md hover:bg-white/5" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-success" />
          </button>
          <div className="h-9 w-9 rounded-full bg-card/60 border border-border/60 grid place-items-center">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Total Portfolio Value" value={12543.67} change={5.2} format="currency" trend="up" />
        <MetricCard title="Active Strategies" value={3} format="number" />
        <MetricCard title="Monthly Return" value={8.4} change={8.4} format="percentage" trend="up" />
        <MetricCard title="Risk Score" value={50} format="number" />
      </div>

      {/* Recent Strategies */}
      <section className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-border/60 bg-card/60 p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Recent Strategies</h2>
            <a href="/builder" className="text-sm text-secondary hover:text-white">Create New</a>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {["Momentum", "RSI Oversold", "MA Crossover", "Bollinger Squeeze"].map((name, i) => (
              <div key={i} className="rounded-lg border border-border/60 bg-card-gradient p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">Updated {2 + i}d ago</p>
                  </div>
                  <span className="text-success text-sm font-medium">+{(4.2 + i).toFixed(1)}%</span>
                </div>
                <div className="mt-3">
                  <ChartComponent type="area" data={genSeries(24, 100 + i * 5, 2)} height={90} showTooltips={false} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Overview & Quick Actions */}
        <div className="grid gap-6">
          <div className="rounded-xl border border-border/60 bg-card/60 p-5">
            <h2 className="font-display text-lg">Market Overview</h2>
            <div className="mt-4 grid gap-4">
              {Object.entries(market).map(([sym, data]) => (
                <div key={sym} className="rounded-lg border border-border/60 bg-card-gradient p-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-muted-foreground">{sym}</span>
                    <span className="text-success">Bullish</span>
                  </div>
                  <ChartComponent type="line" data={data} height={80} showTooltips={false} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-card/60 p-5">
            <h2 className="font-display text-lg">Quick Actions</h2>
            <div className="mt-4 grid gap-3">
              <a href="/builder" className="px-4 py-2 rounded-md btn-gradient text-black font-medium text-center">Create New Strategy</a>
              <button className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">Import Template</button>
              <button className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">Run Backtest</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
