export type ID = string;

export interface Strategy {
  id: ID;
  ownerId: ID;
  title: string;
  description?: string;
  nodes: any[];
  edges: { from: ID; to: ID }[];
  version: number;
  tags: string[];
  privacy: "private" | "public" | "marketplace";
  createdAt: number;
  updatedAt: number;
}

export interface BacktestJob {
  id: ID;
  strategyId: ID;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  result?: any;
  createdAt: number;
}

export interface MarketplaceItem {
  id: ID;
  strategyId: ID;
  title: string;
  price: number;
  rating: number;
  tags: string[];
  isPublished: boolean;
  createdAt: number;
}

const KEY = {
  strategies: "mock_strategies",
  backtests: "mock_backtests",
  marketplace: "mock_marketplace",
  user: "mock_user",
};

function uid(prefix = "id"): ID {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function seedOnce() {
  const seeded = read(KEY.strategies, [] as Strategy[]);
  if (seeded.length) return;
  const ownerId = "mock";
  const baseNodes = [
    { id: uid("n"), type: "indicator", blockType: "RSI", position: { x: 120, y: 80 }, parameters: { period: 14 } },
    { id: uid("n"), type: "condition", blockType: "LessThan", position: { x: 320, y: 80 }, parameters: { threshold: 30 } },
    { id: uid("n"), type: "action", blockType: "BUY", position: { x: 520, y: 80 }, parameters: {} },
  ];
  const strategies: Strategy[] = [
    {
      id: uid("s"),
      ownerId,
      title: "RSI Oversold",
      description: "Buy when RSI < 30",
      nodes: baseNodes,
      edges: [ { from: baseNodes[0].id, to: baseNodes[1].id }, { from: baseNodes[1].id, to: baseNodes[2].id } ],
      version: 1,
      tags: ["rsi", "mean-reversion"],
      privacy: "private",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  ];
  const marketplace: MarketplaceItem[] = [
    { id: uid("m"), strategyId: strategies[0].id, title: "RSI Oversold", price: 0, rating: 4.6, tags: ["rsi"], isPublished: true, createdAt: Date.now() },
  ];
  write(KEY.strategies, strategies);
  write(KEY.marketplace, marketplace);
  write(KEY.backtests, [] as BacktestJob[]);
  write(KEY.user, { id: ownerId, name: "mock", email: "mock@example.com" });
}

export const repo = {
  user() {
    return read(KEY.user, { id: "mock", name: "mock", email: "mock@example.com" });
  },
  listStrategies(ownerId?: ID) {
    const all = read(KEY.strategies, [] as Strategy[]);
    return ownerId ? all.filter((s) => s.ownerId === ownerId) : all;
  },
  getStrategy(id: ID) {
    return read(KEY.strategies, [] as Strategy[]).find((s) => s.id === id) || null;
  },
  saveStrategy(partial: Partial<Strategy> & { title: string }) {
    const all = read(KEY.strategies, [] as Strategy[]);
    if (partial.id) {
      const idx = all.findIndex((s) => s.id === partial.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...partial, updatedAt: Date.now(), version: (all[idx].version || 1) + 1 } as Strategy;
      }
    } else {
      const n: Strategy = {
        id: uid("s"),
        ownerId: this.user().id,
        title: partial.title,
        description: partial.description || "",
        nodes: partial.nodes || [],
        edges: partial.edges || [],
        version: 1,
        tags: partial.tags || [],
        privacy: partial.privacy || "private",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      all.push(n);
      partial.id = n.id;
    }
    write(KEY.strategies, all);
    return partial.id as ID;
  },
  deleteStrategy(id: ID) {
    const all = read(KEY.strategies, [] as Strategy[]).filter((s) => s.id !== id);
    write(KEY.strategies, all);
  },
  marketplace() {
    return read(KEY.marketplace, [] as MarketplaceItem[]);
  },
  publish(strategyId: ID, data: { title?: string; price?: number; tags?: string[] }) {
    const list = read(KEY.marketplace, [] as MarketplaceItem[]);
    const existing = list.find((m) => m.strategyId === strategyId);
    const item: MarketplaceItem = existing || { id: uid("m"), strategyId, title: "", price: 0, rating: 4.5, tags: [], isPublished: true, createdAt: Date.now() };
    Object.assign(item, { ...data, isPublished: true });
    if (!existing) list.push(item);
    write(KEY.marketplace, list);
    const strategies = read(KEY.strategies, [] as Strategy[]);
    const s = strategies.find((x) => x.id === strategyId);
    if (s) { s.privacy = "marketplace"; write(KEY.strategies, strategies); }
    return item;
  },
  importMarket(itemId: ID) {
    const list = read(KEY.marketplace, [] as MarketplaceItem[]);
    const item = list.find((m) => m.id === itemId);
    if (!item) return null;
    const source = this.getStrategy(item.strategyId);
    if (!source) return null;
    const id = this.saveStrategy({ title: `${source.title} (Imported)`, nodes: source.nodes, edges: source.edges, tags: source.tags, privacy: "private" });
    return this.getStrategy(id);
  },
  enqueueBacktest(strategyId: ID) {
    const jobs = read(KEY.backtests, [] as BacktestJob[]);
    const id = uid("job");
    const job: BacktestJob = { id, strategyId, status: "queued", progress: 0, createdAt: Date.now() };
    jobs.push(job);
    write(KEY.backtests, jobs);
    const timer = setInterval(() => {
      const js = read(KEY.backtests, [] as BacktestJob[]);
      const j = js.find((x) => x.id === id)!;
      if (!j) return clearInterval(timer);
      if (j.progress >= 100) { clearInterval(timer); return; }
      j.progress = Math.min(100, j.progress + Math.ceil(Math.random() * 15));
      j.status = j.progress >= 100 ? "completed" : "running";
      if (j.status === "completed") {
        j.result = {
          kpis: { totalReturn: 23.4, annualReturn: 12.3, sharpe: 1.45, maxDrawdown: -8.7, winRate: 62 },
          equityCurve: Array.from({ length: 120 }, (_, i) => ({ date: `${i}`, value: 10000 + i * 45 + Math.random()*200 })),
          drawdownCurve: Array.from({ length: 120 }, (_, i) => ({ date: `${i}`, drawdown: -Math.random()*10 })),
          trades: Array.from({ length: 60 }, (_, i) => ({ id: i+1, date: `${i}`, action: i%2?"BUY":"SELL", qty: 10, price: 100+i, pnl: (Math.random()-0.5)*100 })),
        };
      }
      write(KEY.backtests, js);
    }, 500);
    return id;
  },
  getJob(id: ID) {
    return read(KEY.backtests, [] as BacktestJob[]).find((j) => j.id === id) || null;
  },
};

if (typeof window !== "undefined") {
  seedOnce();
}
