import React from 'react';
import { NodeProps } from 'reactflow';
import { Target, Percent, DollarSign } from 'lucide-react';
import BaseNode from './BaseNode';

const ProfitTargetNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  const isPercentage = data?.type === 'percentage';
  
  return (
    <BaseNode
      {...props}
      title="Profit Target"
      icon={<Target size={16} />}
      color="bg-green-500"
      inputs={[{ id: 'position', label: 'Position' }]}
      outputs={[{ id: 'exit', label: 'Exit Signal' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Type:</span>
          <div className="flex items-center space-x-1">
            {isPercentage ? (
              <Percent size={12} className="text-green-400" />
            ) : (
              <DollarSign size={12} className="text-green-400" />
            )}
            <span className="text-sm text-white capitalize">
              {data?.type || 'percentage'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Target:</span>
          <div className="flex items-center space-x-1">
            {isPercentage ? (
              <span className="text-sm text-green-400 font-semibold">
                +{data?.value || 10}%
              </span>
            ) : (
              <>
                <DollarSign size={12} className="text-green-400" />
                <span className="text-sm text-green-400 font-semibold">
                  +{data?.value || 100}
                </span>
              </>
            )}
          </div>
        </div>
        {data?.trailingStop && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Trailing:</span>
            <span className="text-xs px-2 py-1 bg-blue-900 text-blue-300 rounded font-semibold">
              ENABLED
            </span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default ProfitTargetNode;
