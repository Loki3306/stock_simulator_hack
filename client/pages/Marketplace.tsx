import { repo } from "@/lib/mockRepo";
import { useState, useMemo } from "react";
import { Search, Filter, Star, TrendingUp, DollarSign, Download, Eye, Sparkles, Grid3x3, List, RefreshCw, Trash2, Plus, BarChart3, Users } from "lucide-react";

export default function Marketplace() {
  const [items, setItems] = useState(repo.marketplace());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "free" | "paid">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get all unique tags for the category filter
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    items.forEach(item => item.tags?.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [items]);

  // Get popular categories for quick access
  const popularCategories = ["beginner", "trend-following", "mean-reversion", "momentum", "volatility", "advanced", "professional"];

  // Filter and search items
  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply price filter
    if (selectedFilter === "free") {
      filtered = filtered.filter(item => !item.price || item.price === 0);
    } else if (selectedFilter === "paid") {
      filtered = filtered.filter(item => item.price && item.price > 0);
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.tags?.includes(selectedCategory));
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [items, selectedFilter, selectedCategory, searchQuery]);
  
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Strategy Marketplace
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Discover, import, and share profitable trading strategies from the community
        </p>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-background/80 backdrop-blur-md border border-border/60 rounded-2xl shadow-2xl group-hover:shadow-purple-500/10 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 ml-4">
                  <Search className={`w-5 h-5 transition-colors duration-300 ${
                    searchQuery ? 'text-purple-400' : 'text-muted-foreground'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="Search strategies by name or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-4 bg-transparent border-0 focus:outline-none placeholder:text-muted-foreground/70 text-base font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex items-center justify-center w-10 h-10 mr-4 rounded-xl bg-muted/30 hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-200"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Price Filter */}
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/60 rounded-2xl p-1">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-background/80"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              All
            </button>
            <button
              onClick={() => setSelectedFilter("free")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedFilter === "free"
                  ? "bg-green-500 text-white shadow-md"
                  : "hover:bg-background/80"
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setSelectedFilter("paid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                selectedFilter === "paid"
                  ? "bg-yellow-500 text-black shadow-md"
                  : "hover:bg-background/80"
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Paid
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/60 rounded-2xl p-1">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all text-sm ${
                selectedCategory === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-background/80"
              }`}
            >
              All Categories
            </button>
            {popularCategories.slice(0, 4).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all text-sm ${
                  selectedCategory === category
                    ? "bg-purple-500 text-white shadow-md"
                    : "hover:bg-background/80"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            {filteredItems.length} strateg{filteredItems.length !== 1 ? 'ies' : 'y'} found
          </div>
        </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border border-border/60 rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`flex items-center justify-center px-3 py-2 rounded-xl font-medium transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-background/80"
                }`}
              >
                <Grid3x3 size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`flex items-center justify-center px-3 py-2 rounded-xl font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "hover:bg-background/80"
                }`}
              >
                <List size={16} />
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={refreshMarketplace}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-background/50 backdrop-blur-sm border border-border/60 text-foreground font-medium hover:bg-gradient-to-r hover:from-blue-500/90 hover:to-purple-500/90 hover:text-white hover:border-transparent transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="w-4 h-4 group-hover:animate-spin" />
              Refresh
            </button>

            <button
              onClick={resetAllData}
              className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              <Trash2 className="w-4 h-4" />
              Reset Data
            </button>

            <a
              href="/builder"
              className="group flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
              Create Strategy
            </a>
          </div>
        </div>
      </div>
      <div className={`mt-8 ${viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
        {filteredItems.map((m) => (
          <div
            key={m.id}
            className={`group relative backdrop-blur-xl bg-gradient-to-br from-background/70 via-background/50 to-background/30 border border-white/20 hover:border-white/40 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10 ${
              viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-6'
            }`}
          >
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className={`relative z-10 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-white/10">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground group-hover:text-white transition-colors duration-300">
                        {m.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">Trading Strategy</p>
                    </div>
                  </div>
                </div>
                
                {/* Price Badge */}
                <div className={`px-4 py-2 rounded-2xl border font-semibold text-sm ${
                  m.price ? 
                    'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-300' :
                    'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300'
                }`}>
                  {m.price ? `$${m.price}` : "Free"}
                </div>
              </div>

              {/* Metrics Section */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-black/20 border border-white/10">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold text-white">{m.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">rating</span>
                </div>
                
                <div className="w-px h-6 bg-white/20" />
                
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-blue-300">85%</span>
                  <span className="text-xs text-muted-foreground">success</span>
                </div>
                
                <div className="w-px h-6 bg-white/20" />
                
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="font-semibold text-purple-300">{Math.floor(Math.random() * 1000) + 100}</span>
                  <span className="text-xs text-muted-foreground">users</span>
                </div>
              </div>

              {/* Tags Section */}
              {m.tags && m.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {m.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-xl bg-white/10 border border-white/20 text-xs font-medium text-muted-foreground hover:text-white hover:border-white/40 transition-all duration-200"
                    >
                      #{tag}
                    </span>
                  ))}
                  {m.tags.length > 3 && (
                    <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground">
                      +{m.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const importedStrategy = repo.importMarket(m.id);
                    if (importedStrategy) {
                      localStorage.setItem('imported_strategy_id', importedStrategy.id);
                      location.href = "/builder";
                    } else {
                      alert('Failed to import strategy');
                    }
                  }}
                  className="group/btn flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
                >
                  <Download className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  Import Strategy
                </button>
                
                <a
                  href="/backtest/mock"
                  className="group/btn flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/10 border border-white/20 hover:bg-white/20 hover:border-white/40 text-white font-medium transition-all duration-300 transform hover:scale-105"
                >
                  <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                  Preview
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
