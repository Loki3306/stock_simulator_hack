import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { RefreshCw, User, Plus, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../hooks/use-toast';
import api from '../lib/api';

const UserStrategies: React.FC = () => {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const loadUserStrategies = async () => {
    if (!user) {
      console.log('No user logged in');
      return;
    }

    setLoading(true);
    try {
      console.log('Loading strategies for user:', user);
      const response = await api.get('/strategies');
      setStrategies(response.data);
      console.log('Loaded strategies:', response.data);
    } catch (error) {
      console.error('Failed to load strategies:', error);
      toast({
        title: "Error",
        description: "Failed to load strategies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSampleStrategy = async () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "Please log in to create strategies",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const sampleStrategy = {
        title: `My Test Strategy ${Date.now()}`,
        description: 'A sample strategy created for testing',
        nodes: [
          {
            id: 'stock-1',
            type: 'stock',
            position: { x: 100, y: 100 },
            data: { symbol: 'AAPL', label: 'Apple Inc.' }
          },
          {
            id: 'indicator-1', 
            type: 'technicalIndicator',
            position: { x: 300, y: 100 },
            data: { indicator: 'SMA', period: 20, label: 'SMA 20' }
          }
        ],
        edges: [
          {
            id: 'edge-1',
            source: 'stock-1',
            target: 'indicator-1',
            type: 'default'
          }
        ],
        tags: ['test', 'sample'],
        privacy: 'private'
      };

      const response = await api.post('/strategies', sampleStrategy);
      toast({
        title: "Strategy Created",
        description: "Sample strategy created successfully",
      });
      
      await loadUserStrategies(); // Refresh the list
    } catch (error) {
      console.error('Failed to create strategy:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create sample strategy",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    loadUserStrategies();
  }, [user]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Strategies</h1>
          <p className="text-muted-foreground">Manage your trading strategies</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadUserStrategies} disabled={loading} variant="outline">
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={createSampleStrategy} disabled={creating || !user}>
            <Plus className={`w-4 h-4 mr-2 ${creating ? 'animate-pulse' : ''}`} />
            {creating ? 'Creating...' : 'Create Sample'}
          </Button>
        </div>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Current User
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user ? (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Not logged in</p>
          )}
        </CardContent>
      </Card>

      {/* Strategies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Your Strategies
          </CardTitle>
          <CardDescription>
            Strategies owned by your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!user ? (
            <p className="text-muted-foreground">Please log in to view your strategies</p>
          ) : strategies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No strategies found</p>
              <Button onClick={createSampleStrategy} disabled={creating}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Strategy
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {strategies.map((strategy) => (
                <div key={strategy._id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{strategy.title}</h4>
                    <Badge variant="default">{strategy.privacy}</Badge>
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
                  <div className="pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(`/builder?strategyId=${strategy._id}`, '_blank')}
                    >
                      Open in Builder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStrategies;