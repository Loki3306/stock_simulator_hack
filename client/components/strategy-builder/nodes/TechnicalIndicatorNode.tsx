import React from 'react';
import { NodeProps } from 'reactflow';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import BaseNode from './BaseNode';

const TechnicalIndicatorNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  const getIndicatorColor = (indicator: string) => {
    switch (indicator) {
      case 'RSI': return 'text-purple-400';
      case 'MACD': return 'text-blue-400';
      case 'SMA': return 'text-green-400';
      case 'EMA': return 'text-yellow-400';
      case 'BB': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };
  
  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'above': return <TrendingUp size={12} className="text-green-400" />;
      case 'below': return <TrendingDown size={12} className="text-red-400" />;
      case 'crossover': return <TrendingUp size={12} className="text-blue-400" />;
      case 'crossunder': return <TrendingDown size={12} className="text-orange-400" />;
      default: return <BarChart3 size={12} className="text-gray-400" />;
    }
  };
  
  return (
    <BaseNode
      {...props}
      title="Technical Indicator"
      icon={<BarChart3 size={16} />}
      color="bg-purple-500"
      inputs={[{ id: 'instrument', label: 'Instrument' }]}
      outputs={[{ id: 'signal', label: 'Entry Signal' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Indicator:</span>
          <span className={`text-sm font-semibold ${getIndicatorColor(data?.indicator)}`}>
            {data?.indicator || 'RSI'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Period:</span>
          <span className="text-sm text-white font-mono bg-gray-700 px-2 py-1 rounded">
            {data?.period || 14}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Condition:</span>
          <div className="flex items-center space-x-1">
            {getConditionIcon(data?.condition)}
            <span className="text-sm text-white capitalize">
              {data?.condition || 'above'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Threshold:</span>
          <span className="text-sm text-white font-mono bg-gray-700 px-2 py-1 rounded">
            {data?.threshold || 70}
          </span>
        </div>
      </div>
    </BaseNode>
  );
};

export default TechnicalIndicatorNode;
