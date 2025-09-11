import React from 'react';
import { NodeProps } from 'reactflow';
import { Calculator, DollarSign, Percent, Scale } from 'lucide-react';
import BaseNode from './BaseNode';

const PositionSizingNode: React.FC<NodeProps> = (props) => {
  const { data } = props;
  
  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'kelly': return <Calculator size={12} className="text-purple-400" />;
      case 'fixed_percent': return <Percent size={12} className="text-blue-400" />;
      case 'risk_parity': return <Scale size={12} className="text-green-400" />;
      default: return <DollarSign size={12} className="text-gray-400" />;
    }
  };
  
  const getMethodName = (method: string) => {
    switch (method) {
      case 'kelly': return 'Kelly Criterion';
      case 'fixed_percent': return 'Fixed %';
      case 'risk_parity': return 'Risk Parity';
      case 'fixed': return 'Fixed Amount';
      default: return 'Fixed Amount';
    }
  };
  
  return (
    <BaseNode
      {...props}
      title="Position Sizing"
      icon={<Calculator size={16} />}
      color="bg-indigo-500"
      inputs={[{ id: 'signal', label: 'Signal' }]}
      outputs={[{ id: 'position', label: 'Position' }]}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Method:</span>
          <div className="flex items-center space-x-1">
            {getMethodIcon(data?.method)}
            <span className="text-sm text-white">
              {getMethodName(data?.method)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-300">Value:</span>
          <div className="flex items-center space-x-1">
            {data?.method === 'fixed_percent' ? (
              <span className="text-sm text-white font-semibold">
                {data?.value || 10}%
              </span>
            ) : (
              <>
                <DollarSign size={12} className="text-gray-400" />
                <span className="text-sm text-white font-semibold">
                  {data?.value || 1000}
                </span>
              </>
            )}
          </div>
        </div>
        {data?.maxRisk && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Max Risk:</span>
            <span className="text-sm text-red-400">
              {data.maxRisk}%
            </span>
          </div>
        )}
      </div>
    </BaseNode>
  );
};

export default PositionSizingNode;
