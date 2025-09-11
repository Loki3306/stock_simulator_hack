import React from 'react';
import { NodeProps } from 'reactflow';
import { TrendingUp, DollarSign } from 'lucide-react';
import BaseNode from './BaseNode';

const StockNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  return (
    <BaseNode
      {...props}
      title="Stock/ETF"
      icon={<TrendingUp size={16} />}
      color="bg-blue-500"
      outputs={[{ id: 'instrument', label: 'Instrument' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Symbol:</span>
          <span className="text-sm font-mono text-white bg-gray-700 px-2 py-1 rounded">
            {data?.symbol || 'N/A'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Quantity:</span>
          <span className="text-sm text-white">{data?.quantity || 0}</span>
        </div>
        {data?.currentPrice && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Price:</span>
            <div className="flex items-center space-x-1">
              <DollarSign size={12} className="text-green-400" />
              <span className="text-sm text-green-400">{data.currentPrice}</span>
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default StockNode;
