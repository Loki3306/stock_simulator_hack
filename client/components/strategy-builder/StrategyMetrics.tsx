import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, CheckCircle, Target, Zap, BarChart3, Clock, Shield, Brain, Activity, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useStrategyStore } from '../../stores/strategyStore';
import { Node, Edge } from 'reactflow';

interface StrategyMetricsProps {
  isOpen: boolean;
  nodes?: Node[];
  edges?: Edge[];
}

const StrategyMetrics: React.FC<StrategyMetricsProps> = ({ isOpen, nodes: propNodes, edges: propEdges }) => {
  const { strategyData, validationErrors, isValid } = useStrategyStore();
  
  // Use prop nodes/edges if provided, otherwise fall back to store
  const nodes = propNodes || strategyData.nodes;
  const edges = propEdges || strategyData.edges;
  
  // Calculate comprehensive metrics from the strategy
  const calculateMetrics = () => {
    
    // Basic metrics
    const totalNodes = nodes.length;
    const totalConnections = edges.length;
    
    // Fix completion rate calculation - should be based on strategy completeness
    // A complete strategy needs: Data source -> Indicators -> Conditions -> Actions
    const hasDataSource = nodes.some(n => n.type === 'stock' || n.type === 'optionLeg');
    const hasIndicators = nodes.some(n => n.type === 'technicalIndicator');
    const hasConditions = nodes.some(n => n.type === 'priceCondition');
    const hasActions = nodes.some(n => n.type === 'orderType');
    
    const completionSteps = [hasDataSource, hasIndicators, hasConditions, hasActions];
    // If no nodes exist, completion rate should be 0%
    const completionRate = totalNodes === 0 ? 0 : Math.min(100, (completionSteps.filter(Boolean).length / completionSteps.length) * 100);
    
    // Node type analysis
    const nodeTypes = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Strategy flow analysis
    const entryPoints = nodes.filter(n => edges.filter(e => e.target === n.id).length === 0);
    const exitPoints = nodes.filter(n => edges.filter(e => e.source === n.id).length === 0);
    const maxDepth = calculateMaxDepth(nodes, edges);
    const branchingFactor = calculateBranchingFactor(nodes, edges);
    
    // Strategy complexity (improved calculation)
    let complexityScore = 0;
    complexityScore += totalNodes * 2; // Base complexity
    complexityScore += totalConnections; // Connection complexity
    complexityScore += branchingFactor * 3; // Branching complexity
    complexityScore += maxDepth; // Depth complexity
    
    const complexity = totalNodes === 0 ? 'Empty' :
                      complexityScore <= 15 ? 'Simple' : 
                      complexityScore <= 35 ? 'Moderate' : 
                      complexityScore <= 60 ? 'Complex' : 'Advanced';
    
    // Risk assessment (comprehensive)
    const hasStopLoss = nodes.some(n => n.type === 'stopLoss');
    const hasProfitTarget = nodes.some(n => n.type === 'profitTarget');
    const hasPositionSizing = nodes.some(n => n.type === 'positionSizing');
    const hasRiskManagement = hasStopLoss || hasProfitTarget;
    
    // Performance indicators
    const diversificationScore = Object.keys(nodeTypes).length * 10; // More node types = more diversified
    const connectionRatio = totalNodes > 0 ? totalConnections / totalNodes : 0;
    const strategyHealth = totalNodes === 0 ? 0 : (isValid ? 100 : Math.max(0, 100 - validationErrors.length * 10));
    
    // Time-based metrics (simulated)
    const estimatedSetupTime = totalNodes * 2 + totalConnections; // minutes
    const backtestComplexity = complexityScore;
    
    return {
      totalNodes,
      totalConnections,
      completionRate,
      nodeTypes,
      complexity,
      complexityScore,
      hasRiskManagement,
      hasPositionSizing,
      hasStopLoss,
      hasProfitTarget,
      entryPoints: entryPoints.length,
      exitPoints: exitPoints.length,
      maxDepth,
      branchingFactor,
      diversificationScore,
      connectionRatio,
      strategyHealth,
      estimatedSetupTime,
      backtestComplexity,
      hasDataSource,
      hasIndicators,
      hasConditions,
      hasActions
    };
  };

  // Helper function to calculate maximum depth of strategy
  const calculateMaxDepth = (nodes: any[], edges: any[]): number => {
    const adjacencyList: Record<string, string[]> = {};
    nodes.forEach(node => adjacencyList[node.id] = []);
    edges.forEach(edge => {
      if (adjacencyList[edge.source]) {
        adjacencyList[edge.source].push(edge.target);
      }
    });

    let maxDepth = 0;
    const visited = new Set<string>();
    
    const dfs = (nodeId: string, depth: number) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      maxDepth = Math.max(maxDepth, depth);
      
      adjacencyList[nodeId]?.forEach(childId => {
        dfs(childId, depth + 1);
      });
    };

    nodes.forEach(node => {
      if (!visited.has(node.id)) {
        dfs(node.id, 1);
      }
    });

    return maxDepth;
  };

  // Helper function to calculate branching factor
  const calculateBranchingFactor = (nodes: any[], edges: any[]): number => {
    const outgoingCounts = nodes.map(node => 
      edges.filter(edge => edge.source === node.id).length
    );
    return Math.max(...outgoingCounts, 0);
  };
  
  const metrics = calculateMetrics();
  
  if (!isOpen) return null;
  
  return (
    <div className="h-80 bg-gray-900 border-r border-gray-700 overflow-y-auto strategy-scrollbar">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>Strategy Analytics</span>
          </h3>
          <div className="flex items-center space-x-2">
            {isValid ? (
              <Badge variant="outline" className="border-green-500 text-green-400">
                <CheckCircle size={12} className="mr-1" />
                Valid
              </Badge>
            ) : (
              <Badge variant="outline" className="border-red-500 text-red-400">
                <AlertTriangle size={12} className="mr-1" />
                {validationErrors.filter(e => e.type === 'error').length} Issues
              </Badge>
            )}
          </div>
        </div>
        
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-8 gap-3 mb-4">
          {/* Core Strategy Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total Nodes</p>
                  <p className="text-lg font-bold text-white">{metrics.totalNodes}</p>
                </div>
                <Zap size={16} className="text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Connections</p>
                  <p className="text-lg font-bold text-white">{metrics.totalConnections}</p>
                </div>
                <TrendingUp size={16} className="text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Completion</p>
                  <p className="text-lg font-bold text-white">{Math.round(metrics.completionRate)}%</p>
                </div>
                <CheckCircle size={16} className="text-green-400" />
              </div>
              <Progress value={metrics.completionRate} className="mt-1 h-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Complexity</p>
                  <p className="text-sm font-bold text-white">{metrics.complexity}</p>
                </div>
                <Target size={16} className={`${
                  metrics.complexity === 'Simple' ? 'text-green-400' :
                  metrics.complexity === 'Moderate' ? 'text-yellow-400' : 
                  metrics.complexity === 'Complex' ? 'text-orange-400' : 'text-red-400'
                }`} />
              </div>
              <div className="text-xs text-gray-500 mt-1">Score: {metrics.complexityScore}</div>
            </CardContent>
          </Card>

          {/* Strategy Flow Metrics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Max Depth</p>
                  <p className="text-lg font-bold text-white">{metrics.maxDepth}</p>
                </div>
                <Layers size={16} className="text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Branching</p>
                  <p className="text-lg font-bold text-white">{metrics.branchingFactor}</p>
                </div>
                <Activity size={16} className="text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Health</p>
                  <p className="text-lg font-bold text-white">{Math.round(metrics.strategyHealth)}%</p>
                </div>
                <Shield size={16} className={metrics.strategyHealth >= 80 ? 'text-green-400' : 
                  metrics.strategyHealth >= 60 ? 'text-yellow-400' : 'text-red-400'} />
              </div>
              <Progress value={metrics.strategyHealth} className="mt-1 h-1" />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Setup Time</p>
                  <p className="text-sm font-bold text-white">{metrics.estimatedSetupTime}m</p>
                </div>
                <Clock size={16} className="text-amber-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Strategy Component Analysis */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Brain size={14} className="mr-1" />
                Strategy Components
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Data Source</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasDataSource ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Technical Indicators</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasIndicators ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Entry Conditions</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasConditions ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Actions/Orders</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasActions ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                <Shield size={14} className="mr-1" />
                Risk Management
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Stop Loss</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasStopLoss ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Profit Target</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasProfitTarget ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Position Sizing</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasPositionSizing ? 'bg-green-400' : 'bg-yellow-400'}`} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Overall Risk Mgmt</span>
                  <div className={`w-2 h-2 rounded-full ${metrics.hasRiskManagement ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Node Type Breakdown */}
        {Object.keys(metrics.nodeTypes).length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Node Distribution</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics.nodeTypes).map(([type, count]) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-gray-700 text-gray-300 text-xs"
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Validation Issues */}
        {validationErrors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-400 mb-2 flex items-center">
              <AlertTriangle size={14} className="mr-1" />
              Strategy Issues ({validationErrors.length})
            </h4>
            <div className="space-y-1 max-h-16 overflow-y-auto">
              {validationErrors.slice(0, 4).map((error, index) => (
                <div key={index} className="text-xs text-gray-400 flex items-center space-x-1">
                  <div className="w-1 h-1 bg-red-400 rounded-full" />
                  <span>{error.message}</span>
                </div>
              ))}
              {validationErrors.length > 4 && (
                <div className="text-xs text-gray-500 italic">
                  +{validationErrors.length - 4} more issues...
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StrategyMetrics;
