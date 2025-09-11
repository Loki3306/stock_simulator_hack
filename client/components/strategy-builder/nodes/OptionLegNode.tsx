import React from 'react';
import { NodeProps } from 'reactflow';
import { DollarSign, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import BaseNode from './BaseNode';

const OptionLegNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  const isCall = data?.optionType === 'CALL';
  const isBuy = data?.action === 'BUY';
  
  return (
    <BaseNode
      {...props}
      title="Option Leg"
      icon={<DollarSign size={16} />}
      color="bg-orange-500"
      inputs={[{ id: 'underlying', label: 'Underlying' }]}
      outputs={[{ id: 'option', label: 'Option' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Underlying:</span>
          <span className="text-sm font-mono text-white bg-gray-700 px-2 py-1 rounded">
            {data?.underlying || 'N/A'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Type:</span>
          <div className="flex items-center space-x-1">
            {isCall ? (
              <TrendingUp size={12} className="text-green-400" />
            ) : (
              <TrendingDown size={12} className="text-red-400" />
            )}
            <span className={`text-xs px-2 py-1 rounded font-semibold ${
              isCall ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
            }`}>
              {data?.optionType || 'CALL'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Action:</span>
          <span className={`text-xs px-2 py-1 rounded font-semibold ${
            isBuy ? 'bg-blue-900 text-blue-300' : 'bg-yellow-900 text-yellow-300'
          }`}>
            {data?.action || 'BUY'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Strike:</span>
          <div className="flex items-center space-x-1">
            <DollarSign size={12} className="text-gray-400" />
            <span className="text-sm text-white">{data?.strike || 0}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Expiry:</span>
          <div className="flex items-center space-x-1">
            <Calendar size={12} className="text-gray-400" />
            <span className="text-sm text-white">
              {data?.expiry ? new Date(data.expiry).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Quantity:</span>
          <span className="text-sm text-white">{data?.quantity || 1}</span>
        </div>
        
        {data?.premium && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Premium:</span>
            <div className="flex items-center space-x-1">
              <DollarSign size={12} className="text-purple-400" />
              <span className="text-sm text-purple-400">{data.premium}</span>
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default OptionLegNode;
