import { repo } from "@/lib/mockRepo";

export default function Marketplace() {
  const items = repo.marketplace();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Marketplace</h1>
        <a
          href="/builder"
          className="px-4 py-2 rounded-md btn-gradient text-black font-medium"
        >
          Create Strategy
        </a>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-border/60 bg-card-gradient p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-medium">{m.title}</div>
                <div className="text-xs text-muted-foreground">
                  Rating {m.rating.toFixed(1)}
                </div>
              </div>
              <div className="text-sm">{m.price ? `$${m.price}` : "Free"}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  repo.importMarket(m.id);
                  location.href = "/builder";
                }}
                className="px-3 py-1.5 rounded-md btn-gradient text-black text-sm"
              >
                Import
              </button>
              <a
                href="/backtest/mock"
                className="px-3 py-1.5 rounded-md border border-white/15 text-sm"
              >
                Preview
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
