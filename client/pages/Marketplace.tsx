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
    <div className="min-h-screen bg-[#121212]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] bg-clip-text text-transparent mb-3 md:mb-4">
            Strategy Marketplace
          </h1>
          <p className="text-base sm:text-lg text-[#AFAFAF] mb-6 md:mb-8 px-4 sm:px-0">
            Discover, import, and share profitable trading strategies from the community
          </p>

        {/* Enhanced Search Bar */}
        <div className="max-w-2xl mx-auto mb-6 md:mb-8 px-4 sm:px-0">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4A90E2] via-[#3A7BD5] to-[#4A90E2] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-[#202020] backdrop-blur-md border border-[#4A90E2]/30 rounded-2xl shadow-2xl group-hover:shadow-[#4A90E2]/10 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 ml-3 sm:ml-4">
                  <Search className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${
                    searchQuery ? 'text-[#4A90E2]' : 'text-[#AFAFAF]'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 py-3 sm:py-4 bg-transparent border-0 focus:outline-none placeholder:text-[#AFAFAF] text-[#F0F0F0] text-sm sm:text-base font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 mr-3 sm:mr-4 rounded-xl bg-[#AFAFAF]/20 hover:bg-[#AFAFAF]/30 text-[#AFAFAF] hover:text-[#F0F0F0] transition-all duration-200 text-sm sm:text-base"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 md:mb-8 space-y-4 md:space-y-6 px-4 sm:px-0">
        {/* Consolidated Filter Row */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          {/* Category Filter (Left Side) */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-2xl p-2 w-full xl:w-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`relative flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium transition-all text-xs md:text-sm text-[#F0F0F0] group ${
                selectedCategory === "all" ? "" : ""
              }`}
            >
              <span className="relative group-hover:scale-110 transition-transform duration-300">
                All Categories
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                  selectedCategory === "all" 
                    ? "w-full opacity-100" 
                    : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                }`}></span>
              </span>
            </button>
            {popularCategories.slice(0, 4).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`relative flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-medium transition-all text-xs md:text-sm text-[#F0F0F0] group ${
                  selectedCategory === category ? "" : ""
                }`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    selectedCategory === category 
                      ? "w-full opacity-100" 
                      : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
            ))}
          </div>

          {/* Price Filter (Right Side) */}
          <div className="flex flex-wrap items-center gap-2 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-2xl p-1 w-full xl:w-auto">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`relative flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg font-medium transition-all text-xs md:text-sm text-[#F0F0F0] group ${
                selectedFilter === "all" ? "" : ""
              }`}
            >
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative group-hover:scale-110 transition-transform duration-300">
                All
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                  selectedFilter === "all" 
                    ? "w-full opacity-100" 
                    : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                }`}></span>
              </span>
            </button>
            <button
              onClick={() => setSelectedFilter("free")}
              className={`relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all text-xs md:text-base text-[#F0F0F0] group ${
                selectedFilter === "free" ? "" : ""
              }`}
            >
              <span className="relative group-hover:scale-110 transition-transform duration-300">
                Free
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#28a745] transition-all duration-500 ease-out ${
                  selectedFilter === "free" 
                    ? "w-full opacity-100" 
                    : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                }`}></span>
              </span>
            </button>
            <button
              onClick={() => setSelectedFilter("paid")}
              className={`relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all text-xs md:text-base text-[#F0F0F0] group ${
                selectedFilter === "paid" ? "" : ""
              }`}
            >
              <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="relative group-hover:scale-110 transition-transform duration-300">
                Paid
                <span className={`absolute bottom-0 left-0 h-0.5 bg-[#DC3545] transition-all duration-500 ease-out ${
                  selectedFilter === "paid" 
                    ? "w-full opacity-100" 
                    : "w-0 group-hover:w-full opacity-0 group-hover:opacity-100"
                }`}></span>
              </span>
            </button>
          </div>
        </div>

        
        {/* Results Count */}
        <div className="text-sm text-[#AFAFAF]">
          {filteredItems.length} strateg{filteredItems.length !== 1 ? 'ies' : 'y'} found
        </div>
        
        {/* View Controls and Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-2xl p-1 w-auto">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`relative flex items-center justify-center px-3 py-2 rounded-xl font-medium transition-all text-[#F0F0F0] group ${
                  viewMode === "grid" ? "" : ""
                }`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  <Grid3x3 size={16} />
                  <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    viewMode === "grid" 
                      ? "w-6 opacity-100" 
                      : "w-0 group-hover:w-6 opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`relative flex items-center justify-center px-3 py-2 rounded-xl font-medium transition-all text-[#F0F0F0] group ${
                  viewMode === "list" ? "" : ""
                }`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  <List size={16} />
                  <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    viewMode === "list" 
                      ? "w-6 opacity-100" 
                      : "w-0 group-hover:w-6 opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={refreshMarketplace}
                className="relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl font-medium transition-all text-sm md:text-base text-[#F0F0F0] group"
              >
                <RefreshCw className="w-4 h-4 group-hover:scale-110 transition-transform duration-300 group-hover:animate-spin" />
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  Refresh
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out w-0 group-hover:w-full opacity-0 group-hover:opacity-100`}></span>
                </span>
              </button>

              <a
                href="/builder"
                className="relative flex items-center gap-2 px-4 md:px-6 py-2 rounded-xl font-medium transition-all text-sm md:text-base text-[#F0F0F0] group"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  Create Strategy
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#28a745] transition-all duration-500 ease-out w-0 group-hover:w-full opacity-0 group-hover:opacity-100`}></span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Marketplace Items */}
      <div className={`${viewMode === 'grid' ? 'grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}`}>
        {filteredItems.map((m) => (
          <div
            key={m.id}
            className={`group relative backdrop-blur-xl bg-[#202020]/90 hover:bg-[#282828]/90 border border-[#4A90E2]/20 hover:border-[#4A90E2]/40 rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#4A90E2]/20 ${
              viewMode === 'list' ? 'flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 p-5 lg:p-6' : 'p-5 h-full flex flex-col'
            }`}
          >
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className={`relative z-10 ${viewMode === 'list' ? 'flex-1' : 'flex flex-col h-full'}`}>
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#4A90E2]/20 to-[#3A7BD5]/20 border border-[#4A90E2]/30 backdrop-blur-sm shrink-0">
                      <TrendingUp className="w-5 h-5 text-[#4A90E2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-lg text-[#F0F0F0] group-hover:text-white transition-colors duration-300 line-clamp-2">
                        {m.title}
                      </h3>
                      <p className="text-sm text-[#AFAFAF]">Trading Strategy</p>
                    </div>
                  </div>
                </div>
                
                {/* Price Badge */}
                <div className={`px-3 py-2 rounded-xl border font-bold text-xs sm:text-sm backdrop-blur-sm shrink-0 ml-3 ${
                  m.price ? 
                    'bg-gradient-to-r from-[#4A90E2]/20 to-[#4A90E2]/30 border-[#4A90E2]/40 text-[#4A90E2]' :
                    'bg-gradient-to-r from-[#28a745]/20 to-[#28a745]/30 border-[#28a745]/40 text-[#28a745]'
                }`}>
                  {m.price ? `$${m.price}` : "Free"}
                </div>
              </div>

              {/* Metrics Section */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5 p-3 sm:p-4 rounded-xl bg-[#121212]/60 border border-[#4A90E2]/20 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <Star className="w-4 h-4 text-[#28a745] fill-current shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-sm sm:text-base text-[#F0F0F0] block">{m.rating.toFixed(1)}</span>
                    <span className="text-xs text-[#AFAFAF] hidden sm:inline">rating</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <BarChart3 className="w-4 h-4 text-[#4A90E2] shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-sm sm:text-base text-[#28a745] block">85%</span>
                    <span className="text-xs text-[#AFAFAF] hidden sm:inline">success</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
                  <Users className="w-4 h-4 text-[#4A90E2] shrink-0" />
                  <div className="min-w-0">
                    <span className="font-bold text-sm sm:text-base text-[#F0F0F0] block">{Math.floor(Math.random() * 1000) + 100}</span>
                    <span className="text-xs text-[#AFAFAF] hidden sm:inline">users</span>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              {m.tags && m.tags.length > 0 && (
                <div className={`flex flex-wrap gap-2 ${viewMode === 'grid' ? 'mb-auto pb-5' : 'mb-5'}`}>
                  {m.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2.5 py-1 rounded-lg bg-[#121212]/60 border border-[#4A90E2]/30 text-xs font-medium text-[#4A90E2] hover:text-white hover:bg-[#4A90E2]/20 hover:border-[#4A90E2]/50 transition-all duration-200 backdrop-blur-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                  {m.tags.length > 3 && (
                    <span className="px-2.5 py-1 rounded-lg bg-[#121212]/40 border border-[#AFAFAF]/30 text-xs text-[#AFAFAF] backdrop-blur-sm">
                      +{m.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row gap-3 ${viewMode === 'grid' ? 'mt-auto' : ''}`}>
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
                  className="group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#4A90E2] hover:bg-[#3A7BD5] text-white font-medium text-xs transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:shadow-[#4A90E2]/30 border border-[#4A90E2]/50 hover:border-[#3A7BD5]/70 relative overflow-hidden"
                >
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-out" />
                  
                  {/* Content */}
                  <Download className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-all duration-200 relative z-10" />
                  <span className="relative z-10 tracking-wide">Import</span>
                </button>
                
                <a
                  href="/backtest/mock"
                  className="group/btn flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-transparent border border-[#4A90E2]/60 hover:border-[#4A90E2]/80 hover:bg-[#4A90E2]/10 text-[#F0F0F0] hover:text-white font-medium text-xs transition-all duration-300 transform hover:scale-105 backdrop-blur-sm relative overflow-hidden flex-1 sm:flex-initial"
                >
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-[#4A90E2]/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <Eye className="w-3.5 h-3.5 group-hover/btn:scale-110 transition-all duration-200 relative z-10 text-[#4A90E2]" />
                  <span className="relative z-10 tracking-wide">Preview</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
