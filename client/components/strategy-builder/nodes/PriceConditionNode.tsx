import React from 'react';
import { NodeProps } from 'reactflow';
import { Activity, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import BaseNode from './BaseNode';

const PriceConditionNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  const getConditionIcon = (condition: string) => {
    switch (condition) {
      case 'above': return <ArrowUp size={12} className="text-green-400" />;
      case 'below': return <ArrowDown size={12} className="text-red-400" />;
      case 'between': return <Minus size={12} className="text-yellow-400" />;
      default: return <Activity size={12} className="text-gray-400" />;
    }
  };
  
  return (
    <BaseNode
      {...props}
      title="Price Condition"
      icon={<Activity size={16} />}
      color="bg-purple-500"
      inputs={[{ id: 'instrument', label: 'Instrument' }]}
      outputs={[{ id: 'signal', label: 'Entry Signal' }]}
    >
      <div className="space-y-2">
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
          <span className="text-sm text-gray-300">Value:</span>
          <span className="text-sm text-white font-mono bg-gray-700 px-2 py-1 rounded">
            ${data?.value || 0}
          </span>
        </div>
        {data?.condition === 'between' && data?.upperValue && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Upper:</span>
            <span className="text-sm text-white font-mono bg-gray-700 px-2 py-1 rounded">
              ${data.upperValue}
            </span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default PriceConditionNode;
