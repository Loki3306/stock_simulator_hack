import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle, CheckCircle, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useStrategyStore } from '../../stores/strategyStore';

interface StrategyMetricsProps {
  isOpen: boolean;
}

const StrategyMetrics: React.FC<StrategyMetricsProps> = ({ isOpen }) => {
  const { strategyData, validationErrors, isValid } = useStrategyStore();
  
  // Calculate metrics from the strategy
  const calculateMetrics = () => {
    const { nodes, edges } = strategyData;
    
    // Basic metrics
    const totalNodes = nodes.length;
    const totalConnections = edges.length;
    const completionRate = totalNodes > 0 ? (totalConnections / Math.max(totalNodes - 1, 1)) * 100 : 0;
    
    // Node type analysis
    const nodeTypes = nodes.reduce((acc, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Strategy complexity
    const complexity = totalNodes <= 3 ? 'Simple' : totalNodes <= 7 ? 'Moderate' : 'Complex';
    
    // Risk assessment (basic)
    const hasRiskManagement = nodes.some(n => n.type === 'stopLoss' || n.type === 'profitTarget');
    const hasPositionSizing = nodes.some(n => n.type === 'positionSizing');
    
    return {
      totalNodes,
      totalConnections,
      completionRate,
      nodeTypes,
      complexity,
      hasRiskManagement,
      hasPositionSizing,
    };
  };
  
  const metrics = calculateMetrics();
  
  if (!isOpen) return null;
  
  return (
    <div className="h-48 bg-gray-900 border-r border-gray-700 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Target size={20} />
            <span>Strategy Metrics</span>
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
                {validationErrors.filter(e => e.type === 'error').length} Errors
              </Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-6 gap-4">
          {/* Basic Statistics */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Nodes</p>
                  <p className="text-lg font-bold text-white">{metrics.totalNodes}</p>
                </div>
                <div className="text-blue-400">
                  <Zap size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Connections</p>
                  <p className="text-lg font-bold text-white">{metrics.totalConnections}</p>
                </div>
                <div className="text-purple-400">
                  <TrendingUp size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Completion</p>
                  <p className="text-lg font-bold text-white">{Math.round(metrics.completionRate)}%</p>
                </div>
                <div className="text-green-400">
                  <CheckCircle size={16} />
                </div>
              </div>
              <Progress value={metrics.completionRate} className="mt-1 h-1" />
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Complexity</p>
                  <p className="text-lg font-bold text-white">{metrics.complexity}</p>
                </div>
                <div className={`${
                  metrics.complexity === 'Simple' ? 'text-green-400' :
                  metrics.complexity === 'Moderate' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  <Target size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Risk Management Status */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Risk Mgmt</p>
                  <p className="text-sm font-bold text-white">
                    {metrics.hasRiskManagement ? 'Enabled' : 'Missing'}
                  </p>
                </div>
                <div className={metrics.hasRiskManagement ? 'text-green-400' : 'text-red-400'}>
                  {metrics.hasRiskManagement ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Position Size</p>
                  <p className="text-sm font-bold text-white">
                    {metrics.hasPositionSizing ? 'Configured' : 'Default'}
                  </p>
                </div>
                <div className={metrics.hasPositionSizing ? 'text-green-400' : 'text-yellow-400'}>
                  <DollarSign size={16} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Node Type Breakdown */}
        {Object.keys(metrics.nodeTypes).length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Node Types</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metrics.nodeTypes).map(([type, count]) => (
                <Badge
                  key={type}
                  variant="secondary"
                  className="bg-gray-700 text-gray-300 text-xs"
                >
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-red-400 mb-2">Issues</h4>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {validationErrors.slice(0, 3).map((error, index) => (
                <div key={index} className="text-xs text-gray-400 flex items-center space-x-1">
                  <AlertTriangle size={10} className="text-red-400" />
                  <span>{error.message}</span>
                </div>
              ))}
              {validationErrors.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{validationErrors.length - 3} more issues...
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
