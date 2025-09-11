import { repo } from "@/lib/mockRepo";
import { useState } from "react";

export default function Marketplace() {
  const [items, setItems] = useState(repo.marketplace());
  
  const refreshMarketplace = () => {
    const newItems = repo.refreshMarketplace();
    setItems(newItems);
  };

  const resetAllData = () => {
    const newItems = repo.resetAll();
    setItems(newItems);
    alert('All data cleared and marketplace refreshed with new strategies!');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">Marketplace</h1>
        <div className="flex gap-3">
          <button
            onClick={resetAllData}
            className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            Reset All Data
          </button>
          <button
            onClick={refreshMarketplace}
            className="px-4 py-2 rounded-md border border-white/15 text-sm"
          >
            Refresh Strategies
          </button>
          <a
            href="/builder"
            className="px-4 py-2 rounded-md btn-gradient text-black font-medium"
          >
            Create Strategy
          </a>
        </div>
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
                  const importedStrategy = repo.importMarket(m.id);
                  if (importedStrategy) {
                    // Store the imported strategy ID so the builder can load it
                    localStorage.setItem('imported_strategy_id', importedStrategy.id);
                    location.href = "/builder";
                  } else {
                    alert('Failed to import strategy');
                  }
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
