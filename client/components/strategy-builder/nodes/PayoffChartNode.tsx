import React from 'react';
import { NodeProps } from 'reactflow';
import { BarChart3, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import BaseNode from './BaseNode';

const PayoffChartNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  const getProfitColor = (value: number) => {
    if (value > 0) return 'text-green-400';
    if (value < 0) return 'text-red-400';
    return 'text-gray-400';
  };
  
  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`;
    }
    return `$${value.toFixed(0)}`;
  };
  
  return (
    <BaseNode
      {...props}
      title="Payoff Chart"
      icon={<BarChart3 size={16} />}
      color="bg-emerald-500"
      inputs={[{ id: 'strategy', label: 'Strategy' }]}
      outputs={[{ id: 'analysis', label: 'Analysis' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Chart Type:</span>
          <span className="text-sm text-white">
            {data?.chartType || 'P&L vs Price'}
          </span>
        </div>
        
        <div className="bg-gray-800 rounded p-2 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Max Profit:</span>
            <div className="flex items-center space-x-1">
              <TrendingUp size={10} className="text-green-400" />
              <span className={`text-xs font-semibold ${getProfitColor(data?.maxProfit || 0)}`}>
                {data?.maxProfit ? formatCurrency(data.maxProfit) : 'Unlimited'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Max Loss:</span>
            <div className="flex items-center space-x-1">
              <TrendingDown size={10} className="text-red-400" />
              <span className={`text-xs font-semibold ${getProfitColor(data?.maxLoss || 0)}`}>
                {data?.maxLoss ? formatCurrency(data.maxLoss) : 'Unlimited'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Breakeven:</span>
            <div className="flex items-center space-x-1">
              <DollarSign size={10} className="text-blue-400" />
              <span className="text-xs text-blue-400 font-semibold">
                {data?.breakeven ? `$${data.breakeven}` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
        
        {data?.impliedVolatility && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">IV:</span>
            <span className="text-sm text-yellow-400">
              {data.impliedVolatility}%
            </span>
          </div>
        )}
        
        {data?.timeDecay && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Theta:</span>
            <span className="text-sm text-orange-400">
              {data.timeDecay > 0 ? '+' : ''}{data.timeDecay}
            </span>
          </div>
        )}
        
        <div className="bg-gray-700 h-8 rounded mt-2 flex items-center justify-center">
          <BarChart3 size={14} className="text-gray-400" />
          <span className="text-xs text-gray-400 ml-1">Mini Chart</span>
        </div>
      </div>
    </BaseNode>
  );
};

export default PayoffChartNode;
