import { repo } from "@/lib/mockRepo";
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Filter, Star, TrendingUp, DollarSign, Download, Eye, Sparkles, Grid3x3, List, RefreshCw, Trash2, Plus, BarChart3, Users, ChevronDown, Check, Lock } from "lucide-react";

export default function Marketplace() {
  const [items, setItems] = useState(repo.marketplace());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "free" | "paid">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

    // Sort by price in ascending order (free items first, then by price)
    filtered.sort((a, b) => {
      const priceA = a.price || 0;
      const priceB = b.price || 0;
      return priceA - priceB;
    });

    return filtered;
  }, [items, selectedFilter, selectedCategory, searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);
  
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
    <div className="min-h-screen bg-[#121212] overflow-x-hidden">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 relative">
        {/* Enhanced Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4A90E2] to-[#3A7BD5] bg-clip-text text-transparent mb-3 sm:mb-4">
            Strategy Marketplace
          </h1>
          <p className="text-base sm:text-lg text-[#AFAFAF] mb-6 sm:mb-8 max-w-4xl mx-auto px-2 sm:px-0">
            Discover, import, and share profitable trading strategies from the community
          </p>

        {/* Enhanced Search Bar */}
        <div className="max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8 px-2 sm:px-0">
          <div className="relative group">
            <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-[#4A90E2] via-[#3A7BD5] to-[#4A90E2] rounded-2xl sm:rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative bg-[#202020] backdrop-blur-md border border-[#4A90E2]/30 rounded-xl sm:rounded-2xl shadow-2xl group-hover:shadow-[#4A90E2]/10 transition-all duration-300">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 ml-3 sm:ml-4 shrink-0">
                  <Search className={`w-4 sm:w-5 h-4 sm:h-5 transition-colors duration-300 ${
                    searchQuery ? 'text-[#4A90E2]' : 'text-[#AFAFAF]'
                  }`} />
                </div>
                <input
                  type="text"
                  placeholder="Search strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-2 sm:px-3 py-3 sm:py-4 bg-transparent border-0 focus:outline-none placeholder:text-[#AFAFAF] text-[#F0F0F0] text-sm sm:text-base font-medium min-w-0"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 mr-3 sm:mr-4 rounded-lg sm:rounded-xl bg-[#AFAFAF]/20 hover:bg-[#AFAFAF]/30 text-[#AFAFAF] hover:text-[#F0F0F0] transition-all duration-200 text-base sm:text-lg font-light shrink-0"
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
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Category Filter */}
          <div className="w-full sm:flex-1 sm:mr-4">
            {/* Mobile Custom Dropdown */}
            <div className="sm:hidden" ref={dropdownRef}>
              <div className="relative">
                {/* Dropdown Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#202020]/90 border border-[#4A90E2]/40 rounded-xl px-4 py-3 text-[#F0F0F0] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] backdrop-blur-sm transition-all duration-200 hover:bg-[#282828]/90 hover:border-[#4A90E2]/60"
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                  aria-haspopup="listbox"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-left truncate">
                      {selectedCategory === "all" ? "All Categories" : 
                        selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace('-', ' ')
                      }
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#4A90E2] transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A]/95 border border-[#4A90E2]/30 rounded-xl shadow-2xl backdrop-blur-md z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      {/* All Categories Option */}
                      <button
                        onClick={() => {
                          setSelectedCategory("all");
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-150 hover:bg-[#4A90E2]/10 hover:text-white flex items-center justify-between group ${
                          selectedCategory === "all" 
                            ? "bg-[#4A90E2]/20 text-[#4A90E2] border-l-2 border-[#4A90E2]" 
                            : "text-[#F0F0F0]"
                        }`}
                      >
                        <span>All Categories</span>
                        {selectedCategory === "all" && (
                          <Check className="w-4 h-4 text-[#4A90E2]" />
                        )}
                      </button>
                      
                      {/* Category Options */}
                      {popularCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-150 hover:bg-[#4A90E2]/10 hover:text-white flex items-center justify-between group ${
                            selectedCategory === category 
                              ? "bg-[#4A90E2]/20 text-[#4A90E2] border-l-2 border-[#4A90E2]" 
                              : "text-[#F0F0F0]"
                          }`}
                        >
                          <span>{category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}</span>
                          {selectedCategory === category && (
                            <Check className="w-4 h-4 text-[#4A90E2]" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="hidden sm:flex flex-wrap items-center gap-4 lg:gap-6 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-xl lg:rounded-2xl p-3 lg:p-4">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`relative flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg font-medium transition-all text-xs lg:text-sm text-[#F0F0F0] group whitespace-nowrap ${
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
                  className={`relative flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-lg font-medium transition-all text-xs lg:text-sm text-[#F0F0F0] group whitespace-nowrap ${
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
          </div>

          {/* Price Filter */}
          <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-xl lg:rounded-2xl p-2 lg:p-3 w-full sm:w-auto">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all text-sm text-[#F0F0F0] group whitespace-nowrap flex-1 sm:flex-none justify-center ${
                selectedFilter === "all" ? "bg-[#4A90E2]/20 border border-[#4A90E2]/40" : ""
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
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
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all text-sm text-[#F0F0F0] group whitespace-nowrap flex-1 sm:flex-none justify-center ${
                selectedFilter === "free" ? "bg-[#28a745]/20 border border-[#28a745]/40" : ""
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
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-medium transition-all text-sm text-[#F0F0F0] group whitespace-nowrap flex-1 sm:flex-none justify-center ${
                selectedFilter === "paid" ? "bg-[#DC3545]/20 border border-[#DC3545]/40" : ""
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform duration-300" />
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
        <div className="text-sm text-[#AFAFAF] mt-4">
          {filteredItems.length} strateg{filteredItems.length !== 1 ? 'ies' : 'y'} found
        </div>
        
        {/* View Controls and Actions */}
        <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-3 sm:gap-4 mt-4 sm:mt-6">
            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 sm:gap-2 bg-[#202020]/80 backdrop-blur-sm border border-[#4A90E2]/30 rounded-lg sm:rounded-xl lg:rounded-2xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                className={`relative flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all text-[#F0F0F0] group ${
                  viewMode === "grid" ? "" : ""
                }`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  <Grid3x3 size={14} className="sm:w-4 sm:h-4" />
                  <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    viewMode === "grid" 
                      ? "w-4 sm:w-6 opacity-100" 
                      : "w-0 group-hover:w-4 sm:group-hover:w-6 opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                aria-label="List view"
                className={`relative flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all text-[#F0F0F0] group ${
                  viewMode === "list" ? "" : ""
                }`}
              >
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  <List size={14} className="sm:w-4 sm:h-4" />
                  <span className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out ${
                    viewMode === "list" 
                      ? "w-4 sm:w-6 opacity-100" 
                      : "w-0 group-hover:w-4 sm:group-hover:w-6 opacity-0 group-hover:opacity-100"
                  }`}></span>
                </span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 justify-center">
              <button
                onClick={refreshMarketplace}
                className="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all text-xs sm:text-sm text-[#F0F0F0] group"
              >
                <RefreshCw className="w-3 sm:w-4 h-3 sm:h-4 group-hover:scale-110 transition-transform duration-300 group-hover:animate-spin" />
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  <span className="hidden sm:inline">Refresh</span>
                  <span className="sm:hidden">↻</span>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#4A90E2] transition-all duration-500 ease-out w-0 group-hover:w-full opacity-0 group-hover:opacity-100`}></span>
                </span>
              </button>

              <a
                href="/builder"
                className="relative flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg font-medium transition-all text-xs sm:text-sm text-[#F0F0F0] group"
              >
                <Plus className="w-3 sm:w-4 h-3 sm:h-4 group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                <span className="relative group-hover:scale-110 transition-transform duration-300">
                  <span className="hidden sm:inline">Create Strategy</span>
                  <span className="sm:hidden">Create</span>
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#28a745] transition-all duration-500 ease-out w-0 group-hover:w-full opacity-0 group-hover:opacity-100`}></span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      
      {/* Marketplace Items */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`${
          viewMode === 'grid' 
            ? 'grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr' 
            : 'space-y-4'
        }`}>
          {filteredItems.map((m) => (
            <div
              key={m.id}
              className={`group relative backdrop-blur-xl bg-[#202020]/90 hover:bg-[#282828]/90 border border-[#4A90E2]/20 hover:border-[#4A90E2]/40 rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.01] hover:shadow-lg sm:hover:shadow-xl hover:shadow-[#4A90E2]/20 ${
                viewMode === 'list' 
                  ? 'flex flex-col md:flex-row items-start md:items-center gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-5' 
                  : 'p-3 sm:p-4 lg:p-5 h-full flex flex-col min-h-[280px] sm:min-h-[320px]'
              }`}
          >
            {/* Glass shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className={`relative z-10 ${viewMode === 'list' ? 'flex-1 w-full' : 'flex flex-col h-full'}`}>
              {/* Header Section */}
              <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                <div className="flex-1 min-w-0 pr-2 sm:pr-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 mb-1.5 sm:mb-2">
                    <div className="p-1.5 sm:p-2 lg:p-2.5 rounded-md sm:rounded-lg lg:rounded-xl bg-gradient-to-br from-[#4A90E2]/20 to-[#3A7BD5]/20 border border-[#4A90E2]/30 backdrop-blur-sm shrink-0">
                      <TrendingUp className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 text-[#4A90E2]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm sm:text-base lg:text-lg text-[#F0F0F0] group-hover:text-white transition-colors duration-300 line-clamp-2 leading-tight">
                        {m.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#AFAFAF] mt-0.5">Trading Strategy</p>
                    </div>
                  </div>
                </div>
                
                {/* Price Badge */}
                <div className={`flex items-center gap-1 px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg lg:rounded-xl border font-bold text-xs sm:text-sm backdrop-blur-sm shrink-0 ${
                  m.price > 0 ? 
                    'bg-gradient-to-r from-[#DC3545]/20 to-[#DC3545]/30 border-[#DC3545]/40 text-[#DC3545]' :
                    'bg-gradient-to-r from-[#28a745]/20 to-[#28a745]/30 border-[#28a745]/40 text-[#28a745]'
                }`}>
                  {m.price > 0 && <Lock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                  {m.price > 0 ? `$${m.price}` : "Free"}
                </div>
              </div>

              {/* Metrics Section */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3 mb-3 sm:mb-4 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl bg-[#121212]/60 border border-[#4A90E2]/20 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-0.5 sm:gap-1 text-center min-w-0">
                  <Star className="w-3 sm:w-4 h-3 sm:h-4 text-[#28a745] fill-current shrink-0" />
                  <div className="min-w-0 w-full">
                    <span className="font-bold text-xs sm:text-sm text-[#F0F0F0] block truncate">{m.rating.toFixed(1)}</span>
                    <span className="text-xs text-[#AFAFAF] hidden sm:block">rating</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-0.5 sm:gap-1 text-center min-w-0">
                  <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-[#4A90E2] shrink-0" />
                  <div className="min-w-0 w-full">
                    <span className="font-bold text-xs sm:text-sm text-[#28a745] block truncate">85%</span>
                    <span className="text-xs text-[#AFAFAF] hidden sm:block">success</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-0.5 sm:gap-1 text-center min-w-0">
                  <Users className="w-3 sm:w-4 h-3 sm:h-4 text-[#4A90E2] shrink-0" />
                  <div className="min-w-0 w-full">
                    <span className="font-bold text-xs sm:text-sm text-[#F0F0F0] block truncate">{Math.floor(Math.random() * 1000) + 100}</span>
                    <span className="text-xs text-[#AFAFAF] hidden sm:block">users</span>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              {m.tags && m.tags.length > 0 && (
                <div className={`flex flex-wrap gap-1 sm:gap-1.5 lg:gap-2 ${viewMode === 'grid' ? 'mb-auto pb-2 sm:pb-3 lg:pb-4' : 'mb-3 sm:mb-4'}`}>
                  {m.tags.slice(0, viewMode === 'grid' ? 2 : 3).map((tag, index) => (
                    <span
                      key={index}
                      className="px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#121212]/60 border border-[#4A90E2]/30 text-xs font-medium text-[#4A90E2] hover:text-white hover:bg-[#4A90E2]/20 hover:border-[#4A90E2]/50 transition-all duration-200 backdrop-blur-sm truncate max-w-[80px] sm:max-w-none"
                    >
                      #{tag}
                    </span>
                  ))}
                  {m.tags.length > (viewMode === 'grid' ? 2 : 3) && (
                    <span className="px-1.5 sm:px-2 lg:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-[#121212]/40 border border-[#AFAFAF]/30 text-xs text-[#AFAFAF] backdrop-blur-sm">
                      +{m.tags.length - (viewMode === 'grid' ? 2 : 3)}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex flex-col xs:flex-row gap-1.5 sm:gap-2 lg:gap-3 ${viewMode === 'grid' ? 'mt-auto' : 'mt-3 sm:mt-4'}`}>
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
                  className="group/btn flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-[#4A90E2] hover:bg-[#3A7BD5] text-white font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 hover:shadow-sm sm:hover:shadow-md hover:shadow-[#4A90E2]/30 border border-[#4A90E2]/50 hover:border-[#3A7BD5]/70 relative overflow-hidden min-h-[36px] sm:min-h-[40px]"
                >
                  {/* Subtle shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-out" />
                  
                  {/* Content */}
                  <Download className="w-3 sm:w-3.5 h-3 sm:h-3.5 group-hover/btn:scale-110 transition-all duration-200 relative z-10 shrink-0" />
                  <span className="relative z-10 tracking-wide">Import</span>
                </button>
                
                <a
                  href="/backtest/mock"
                  className="group/btn flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg bg-transparent border border-[#4A90E2]/60 hover:border-[#4A90E2]/80 hover:bg-[#4A90E2]/10 text-[#F0F0F0] hover:text-white font-medium text-xs sm:text-sm transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 backdrop-blur-sm relative overflow-hidden flex-1 xs:flex-initial xs:min-w-[80px] sm:min-w-[90px] min-h-[36px] sm:min-h-[40px]"
                >
                  {/* Subtle glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4A90E2]/5 to-[#4A90E2]/10 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  
                  {/* Content */}
                  <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5 group-hover/btn:scale-110 transition-all duration-200 relative z-10 text-[#4A90E2] shrink-0" />
                  <span className="relative z-10 tracking-wide">Preview</span>
                </a>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}
