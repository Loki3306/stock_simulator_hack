import React from 'react';
import { NodeProps } from 'reactflow';
import { Clock, Zap, TrendingUp, Building2 } from 'lucide-react';
import BaseNode from './BaseNode';

const OrderTypeNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'market': return <Zap size={12} className="text-red-400" />;
      case 'limit': return <TrendingUp size={12} className="text-blue-400" />;
      case 'stop': return <Clock size={12} className="text-yellow-400" />;
      case 'stop_limit': return <Building2 size={12} className="text-purple-400" />;
      default: return <Zap size={12} className="text-gray-400" />;
    }
  };
  
  const getOrderName = (type: string) => {
    switch (type) {
      case 'market': return 'Market';
      case 'limit': return 'Limit';
      case 'stop': return 'Stop';
      case 'stop_limit': return 'Stop Limit';
      default: return 'Market';
    }
  };
  
  const getOrderDescription = (type: string) => {
    switch (type) {
      case 'market': return 'Execute immediately at current price';
      case 'limit': return 'Execute only at specified price or better';
      case 'stop': return 'Execute when price hits stop level';
      case 'stop_limit': return 'Stop order becomes limit order';
      default: return 'Execute immediately';
    }
  };
  
  return (
    <BaseNode
      {...props}
      title="Order Type"
      icon={<Building2 size={16} />}
      color="bg-purple-500"
      inputs={[{ id: 'position', label: 'Position' }]}
      outputs={[{ id: 'order', label: 'Order' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Type:</span>
          <div className="flex items-center space-x-1">
            {getOrderIcon(data?.type)}
            <span className="text-sm text-white font-semibold">
              {getOrderName(data?.type)}
            </span>
          </div>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {getOrderDescription(data?.type)}
        </div>
        {(data?.type === 'limit' || data?.type === 'stop_limit') && data?.price && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Price:</span>
            <span className="text-sm text-green-400 font-semibold">
              ${data.price}
            </span>
          </div>
        )}
        {(data?.type === 'stop' || data?.type === 'stop_limit') && data?.stopPrice && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Stop:</span>
            <span className="text-sm text-red-400 font-semibold">
              ${data.stopPrice}
            </span>
          </div>
        )}
        {data?.timeInForce && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Duration:</span>
            <span className="text-sm text-blue-400">
              {data.timeInForce}
            </span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default OrderTypeNode;
