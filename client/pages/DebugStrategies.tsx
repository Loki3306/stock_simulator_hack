import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RefreshCw, Database, HardDrive, Upload } from 'lucide-react';
import { StrategyMigration } from '../lib/migration';
import { useToast } from '../hooks/use-toast';
import api from '../lib/api';

const DebugStrategies: React.FC = () => {
  const [localStrategies, setLocalStrategies] = useState<any[]>([]);
  const [dbStrategies, setDbStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const { toast } = useToast();

  const loadData = async () => {
    setLoading(true);
    try {
      // Load localStorage strategies
      const local = StrategyMigration.getLocalStrategies();
      setLocalStrategies(local);

      // Load database strategies
      const response = await api.get('/strategies');
      setDbStrategies(response.data);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({
        title: "Error",
        description: "Failed to load strategy data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const performMigration = async () => {
    setMigrating(true);
    try {
      const success = await StrategyMigration.performMigration();
      if (success) {
        toast({
          title: "Migration Complete",
          description: "Successfully migrated strategies to database",
        });
        await loadData(); // Refresh data
      } else {
        toast({
          title: "Migration Failed",
          description: "Failed to migrate strategies",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Migration failed:', error);
      toast({
        title: "Migration Error",
        description: "An error occurred during migration",
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  const debugLocalStorage = () => {
    console.log('=== DEBUG: LocalStorage Contents ===');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`${key}:`, value);
    }
    console.log('================================');
    
    toast({
      title: "Debug Complete",
      description: "Check browser console for localStorage contents",
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Strategy Storage Debug</h1>
          <p className="text-muted-foreground">Debug and migrate your trading strategies</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadData} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={debugLocalStorage} variant="outline">
            <HardDrive className="w-4 h-4 mr-2" />
            Debug Console
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* LocalStorage Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              LocalStorage Strategies
            </CardTitle>
            <CardDescription>
              Strategies stored in your browser's localStorage
            </CardDescription>
          </CardHeader>
          <CardContent>
            {localStrategies.length === 0 ? (
              <p className="text-muted-foreground">No strategies found in localStorage</p>
            ) : (
              <div className="space-y-3">
                {localStrategies.map((strategy, index) => (
                  <div key={index} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{strategy.name || 'Untitled Strategy'}</h4>
                      <Badge variant="secondary">Local</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {strategy.description || 'No description'}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Nodes: {strategy.nodes?.length || 0}</span>
                      <span>Edges: {strategy.edges?.length || 0}</span>
                      {strategy.timestamp && (
                        <span>Modified: {new Date(strategy.timestamp).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
                
                {localStrategies.length > 0 && !StrategyMigration.hasMigrated() && (
                  <Button 
                    onClick={performMigration} 
                    disabled={migrating}
                    className="w-full mt-4"
                  >
                    <Upload className={`w-4 h-4 mr-2 ${migrating ? 'animate-pulse' : ''}`} />
                    {migrating ? 'Migrating...' : 'Migrate to Database'}
                  </Button>
                )}
                
                {StrategyMigration.hasMigrated() && (
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-green-800 text-sm">✅ Strategies already migrated</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Database Strategies
            </CardTitle>
            <CardDescription>
              Strategies stored in MongoDB database
            </CardDescription>
          </CardHeader>
          <CardContent>
            {dbStrategies.length === 0 ? (
              <p className="text-muted-foreground">No strategies found in database</p>
            ) : (
              <div className="space-y-3">
                {dbStrategies.map((strategy) => (
                  <div key={strategy._id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{strategy.title}</h4>
                      <Badge variant="default">Database</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {strategy.description || 'No description'}
                    </p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>Nodes: {strategy.nodes?.length || 0}</span>
                      <span>Edges: {strategy.edges?.length || 0}</span>
                      <span>Created: {new Date(strategy.createdAt).toLocaleDateString()}</span>
                    </div>
                    {strategy.tags && strategy.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {strategy.tags.map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Migration Status */}
      <Card>
        <CardHeader>
          <CardTitle>Migration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{localStrategies.length}</p>
              <p className="text-sm text-muted-foreground">Local Strategies</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{dbStrategies.length}</p>
              <p className="text-sm text-muted-foreground">Database Strategies</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {StrategyMigration.hasMigrated() ? '✅' : '❌'}
              </p>
              <p className="text-sm text-muted-foreground">Migration Status</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {StrategyMigration.checkForLocalStrategies() ? '⚠️' : '✅'}
              </p>
              <p className="text-sm text-muted-foreground">Needs Migration</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugStrategies;