import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStrategyStore } from "@/stores/strategyStore";
import api from "@/lib/api";
import { 
  User, 
  Settings, 
  Trash2, 
  Edit, 
  Download, 
  Upload, 
  BarChart3, 
  Calendar,
  Search,
  Filter,
  Grid3x3,
  List,
  Plus,
  Eye,
  Share,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserStrategy {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  nodes: any[];
  edges: any[];
  tags: string[];
  privacy: "private" | "public" | "marketplace";
  createdAt: string;
  updatedAt: string;
  version: number;
  backtest_results?: {
    total_return_pct: number;
    max_drawdown_pct: number;
    total_trades: number;
    win_rate_pct: number;
  };
}

interface UserStats {
  totalStrategies: number;
  profitableStrategies: number;
  averageReturn: number;
  totalBacktests: number;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const { importStrategy } = useStrategyStore();
  const [strategies, setStrategies] = useState<UserStrategy[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalStrategies: 0,
    profitableStrategies: 0,
    averageReturn: 0,
    totalBacktests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "private" | "public" | "marketplace">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteStrategyId, setDeleteStrategyId] = useState<string | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);

  // Load user strategies and stats
  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  // Refresh data periodically to catch new strategies
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        console.log('Auto-refreshing user strategies...');
        loadUserData();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load user strategies - don't send owner param, the auth middleware handles this
      const strategiesResponse = await api.get('/strategies');
      console.log('Loaded strategies from API:', strategiesResponse.data);
      console.log('API response type:', typeof strategiesResponse.data);
      console.log('Is array:', Array.isArray(strategiesResponse.data));
      
      const userStrategies = strategiesResponse.data || [];
      
      // Ensure we have an array before trying to filter
      if (!Array.isArray(userStrategies)) {
        console.error('API returned non-array data:', userStrategies);
        throw new Error('Invalid API response format - expected array');
      }
      
      // Filter to only show strategies owned by current user
      const myStrategies = userStrategies.filter((strategy: any) => 
        strategy.ownerId === user?.id
      );
      
      console.log('Filtered my strategies:', myStrategies);
      setStrategies(myStrategies);
      
      // Calculate user stats
      const stats = calculateUserStats(myStrategies);
      setUserStats(stats);
      
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Mock data for development
      const mockStrategies = generateMockStrategies();
      setStrategies(mockStrategies);
      setUserStats(calculateUserStats(mockStrategies));
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = (strategies: UserStrategy[]): UserStats => {
    const totalStrategies = strategies.length;
    const strategiesWithResults = strategies.filter(s => s.backtest_results);
    const profitableStrategies = strategiesWithResults.filter(s => 
      s.backtest_results && s.backtest_results.total_return_pct > 0
    ).length;
    const averageReturn = strategiesWithResults.length > 0 
      ? strategiesWithResults.reduce((sum, s) => sum + (s.backtest_results?.total_return_pct || 0), 0) / strategiesWithResults.length
      : 0;
    const totalBacktests = strategiesWithResults.length;

    return {
      totalStrategies,
      profitableStrategies,
      averageReturn,
      totalBacktests,
    };
  };

  const generateMockStrategies = (): UserStrategy[] => {
    return [
      {
        _id: "mock-1",
        ownerId: "mock-user-id", // Add ownerId for mock strategies
        title: "SMA Crossover Strategy",
        description: "A simple moving average crossover strategy using 20 and 50 period SMAs",
        nodes: [],
        edges: [],
        tags: ["beginner", "trend-following", "SMA"],
        privacy: "private",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        version: 3,
        backtest_results: {
          total_return_pct: 15.7,
          max_drawdown_pct: -8.2,
          total_trades: 24,
          win_rate_pct: 67.8
        }
      },
      {
        _id: "mock-2", 
        ownerId: "mock-user-id", // Add ownerId for mock strategies
        title: "RSI Mean Reversion",
        description: "Buy oversold conditions and sell overbought using RSI indicator",
        nodes: [],
        edges: [],
        tags: ["intermediate", "mean-reversion", "RSI"],
        privacy: "public",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        version: 1,
        backtest_results: {
          total_return_pct: -3.2,
          max_drawdown_pct: -12.1,
          total_trades: 45,
          win_rate_pct: 42.3
        }
      },
      {
        _id: "mock-3",
        ownerId: "mock-user-id", // Add ownerId for mock strategies
        title: "Bollinger Band Squeeze",
        description: "Advanced volatility strategy using Bollinger Bands and volume analysis",
        nodes: [],
        edges: [],
        tags: ["advanced", "volatility", "bollinger-bands"],
        privacy: "marketplace",
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        version: 5,
        backtest_results: {
          total_return_pct: 28.4,
          max_drawdown_pct: -6.7,
          total_trades: 18,
          win_rate_pct: 81.2
        }
      }
    ];
  };

  // Filter strategies based on search and filter
  const filteredStrategies = useMemo(() => {
    let filtered = strategies;

    // Apply privacy filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter(strategy => strategy.privacy === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(strategy => 
        strategy.title.toLowerCase().includes(query) ||
        strategy.description.toLowerCase().includes(query) ||
        strategy.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [strategies, selectedFilter, searchQuery]);

  const handleDeleteStrategy = async (strategyId: string) => {
    try {
      await api.delete(`/strategies/${strategyId}`);
      setStrategies(prev => prev.filter(s => s._id !== strategyId));
      const updatedStrategies = strategies.filter(s => s._id !== strategyId);
      setUserStats(calculateUserStats(updatedStrategies));
    } catch (error) {
      console.error('Failed to delete strategy:', error);
      // For demo, just remove from local state
      setStrategies(prev => prev.filter(s => s._id !== strategyId));
    } finally {
      setDeleteStrategyId(null);
    }
  };

  const handleExportStrategy = (strategy: UserStrategy) => {
    const exportData = {
      ...strategy,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.name || user?.email
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${strategy.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportStrategy = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // Convert to StrategyData format if needed
        const strategyData = {
          id: importedData.id || `strategy-${Date.now()}`,
          name: importedData.name || importedData.title || 'Imported Strategy',
          description: importedData.description || '',
          nodes: importedData.nodes || [],
          edges: importedData.edges || [],
          metadata: importedData.metadata || {
            created: importedData.createdAt || new Date().toISOString(),
            lastModified: importedData.updatedAt || new Date().toISOString(),
            version: importedData.version || 1,
            backtest_results: importedData.backtest_results
          }
        };
        
        importStrategy(strategyData);
        // Navigate to strategy builder
        window.location.href = '/builder';
      } catch (error) {
        console.error('Failed to import strategy:', error);
        alert('Failed to import strategy. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your profile</h1>
          <p className="text-muted-foreground">You need to be authenticated to access your profile and strategies.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-purple-500/20">
                <AvatarImage src={user.email ? `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}` : undefined} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                  {user.name?.slice(0, 2).toUpperCase() || user.email?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-background flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {user.name || 'Anonymous Trader'}
              </h1>
              <p className="text-lg text-muted-foreground mb-2">{user.email}</p>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {user.role || 'User'}
                </Badge>
                <Badge variant="outline">
                  Member since {new Date().getFullYear() - 1}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowEditProfile(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-200/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Total Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{userStats.totalStrategies}</div>
            <p className="text-sm text-muted-foreground mt-2">Created by you</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-200/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Profitable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{userStats.profitableStrategies}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {userStats.totalStrategies > 0 ? Math.round((userStats.profitableStrategies / userStats.totalStrategies) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-200/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Avg. Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${userStats.averageReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {userStats.averageReturn >= 0 ? '+' : ''}{userStats.averageReturn.toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground mt-2">Across all backtests</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-200/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Backtests Run
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{userStats.totalBacktests}</div>
            <p className="text-sm text-muted-foreground mt-2">Total simulations</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="strategies" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="strategies">My Strategies</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="strategies" className="space-y-6">
          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search your strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="bg-background border border-border rounded-md px-3 py-2 text-sm"
                >
                  <option value="all">All Strategies</option>
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="marketplace">Marketplace</option>
                </select>
              </div>

              <div className="flex items-center border border-border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              <input
                type="file"
                accept=".json"
                onChange={handleImportStrategy}
                className="hidden"
                id="import-strategy"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-strategy')?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>

              <Button onClick={loadUserData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Strategies Grid/List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredStrategies.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No strategies found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery || selectedFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start building your first trading strategy!"}
              </p>
              <Button onClick={() => window.location.href = '/builder'}>
                <Plus className="w-4 h-4 mr-2" />
                Create Strategy
              </Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              {filteredStrategies.map((strategy, index) => (
                <StrategyCard
                  key={strategy._id || `strategy-${index}`}
                  strategy={strategy}
                  viewMode={viewMode}
                  onDelete={() => setDeleteStrategyId(strategy._id)}
                  onExport={() => handleExportStrategy(strategy)}
                  onEdit={() => {
                    // Open strategy in builder with strategy ID
                    window.location.href = `/builder?strategyId=${strategy._id}`;
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="shared" className="space-y-6">
          <div className="text-center py-12">
            <Share className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Shared Strategies</h3>
            <p className="text-muted-foreground">
              Strategies shared with you by other users will appear here
            </p>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Display Name</label>
                <Input defaultValue={user.name} className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={user.email} disabled className="mt-1" />
              </div>
              <div>
                <label className="text-sm font-medium">Trading Preferences</label>
                <div className="mt-2 space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Enable email notifications for backtest completion</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm">Show advanced metrics by default</span>
                  </label>
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteStrategyId} onOpenChange={() => setDeleteStrategyId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Strategy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this strategy? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteStrategyId && handleDeleteStrategy(deleteStrategyId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Strategy Card Component
function StrategyCard({
  strategy,
  viewMode,
  onDelete,
  onExport,
  onEdit
}: {
  strategy: UserStrategy;
  viewMode: "grid" | "list";
  onDelete: () => void;
  onExport: () => void;
  onEdit: () => void;
}) {
  const getPrivacyColor = (privacy: string) => {
    switch (privacy) {
      case 'private': return 'bg-gray-100 text-gray-800';
      case 'public': return 'bg-blue-100 text-blue-800';
      case 'marketplace': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getReturnColor = (returnPct: number) => {
    if (returnPct > 0) return 'text-green-600';
    if (returnPct < 0) return 'text-red-600';
    return 'text-muted-foreground';
  };

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-200 hover:border-purple-500/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{strategy.title}</h3>
                <Badge className={getPrivacyColor(strategy.privacy)}>
                  {strategy.privacy}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  v{strategy.version}
                </span>
              </div>
              <p className="text-muted-foreground mb-2 line-clamp-1">{strategy.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Updated {new Date(strategy.updatedAt).toLocaleDateString()}</span>
                {strategy.backtest_results && (
                  <>
                    <span className={getReturnColor(strategy.backtest_results.total_return_pct)}>
                      {strategy.backtest_results.total_return_pct > 0 ? '+' : ''}{strategy.backtest_results.total_return_pct.toFixed(1)}%
                    </span>
                    <span>{strategy.backtest_results.total_trades} trades</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onExport}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 hover:border-purple-500/50 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 group-hover:text-purple-600 transition-colors">
              {strategy.title}
            </CardTitle>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getPrivacyColor(strategy.privacy)}>
                {strategy.privacy}
              </Badge>
              <Badge variant="outline">v{strategy.version}</Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{strategy.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {strategy.backtest_results && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Return:</span>
                <span className={`ml-2 font-medium ${getReturnColor(strategy.backtest_results.total_return_pct)}`}>
                  {strategy.backtest_results.total_return_pct > 0 ? '+' : ''}{strategy.backtest_results.total_return_pct.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Trades:</span>
                <span className="ml-2 font-medium">{strategy.backtest_results.total_trades}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Win Rate:</span>
                <span className="ml-2 font-medium">{strategy.backtest_results.win_rate_pct.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-muted-foreground">Max DD:</span>
                <span className="ml-2 font-medium text-red-600">{strategy.backtest_results.max_drawdown_pct.toFixed(1)}%</span>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            <span>Updated {new Date(strategy.updatedAt).toLocaleDateString()}</span>
            <div className="flex gap-1">
              {strategy.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {strategy.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{strategy.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}