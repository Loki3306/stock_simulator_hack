import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { motion } from 'framer-motion';

interface BaseNodeProps extends NodeProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  children?: React.ReactNode;
  inputs?: Array<{ id: string; label: string }>;
  outputs?: Array<{ id: string; label: string }>;
}

const BaseNode: React.FC<BaseNodeProps> = ({
  title,
  icon,
  color,
  children,
  inputs = [{ id: 'input', label: 'Input' }],
  outputs = [{ id: 'output', label: 'Output' }],
  selected,
  ...nodeProps
}) => {
  return (
    <div
      className={`bg-gray-800 border-2 rounded-lg shadow-lg min-w-[200px] transition-all duration-200 cursor-pointer ${
        selected ? 'border-purple-500 shadow-purple-500/50' : 'border-gray-600'
      }`}
      onClick={(e) => {
        console.log('BaseNode clicked!', { title, selected });
        // Don't prevent default - let React Flow handle it
      }}
      style={{
        transform: 'scale(1)',
      }}
    >
      {/* Input Handles */}
      {inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: `${((index + 1) * 100) / (inputs.length + 1)}%`,
            background: '#6366f1',
            border: '2px solid #4f46e5',
            width: '12px',
            height: '12px',
          }}
        />
      ))}

      {/* Node Header */}
      <div className={`${color} px-4 py-2 rounded-t-md`}>
        <div className="flex items-center space-x-2">
          <div className="text-white">{icon}</div>
          <h3 className="font-semibold text-white text-sm">{title}</h3>
        </div>
      </div>

      {/* Node Content */}
      <div className="p-4">
        {children}
      </div>

      {/* Output Handles */}
      {outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: `${((index + 1) * 100) / (outputs.length + 1)}%`,
            background: '#10b981',
            border: '2px solid #059669',
            width: '12px',
            height: '12px',
          }}
        />
      ))}
    </div>
  );
};

export default BaseNode;
