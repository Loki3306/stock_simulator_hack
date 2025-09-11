import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Shield,
  Calculator,
  Play,
  BarChart3,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Activity,
  Clock,
  Volume2,
  Settings,
  Zap,
} from 'lucide-react';

interface NodeCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  nodes: NodeDefinition[];
}

interface NodeDefinition {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const nodeCategories: NodeCategory[] = [
  {
    id: 'market-data',
    name: 'Market Data',
    icon: <TrendingUp size={16} />,
    color: 'bg-blue-500',
    nodes: [
      {
        id: 'stock',
        type: 'stock',
        name: 'Stock/ETF',
        description: 'Stock or ETF with quantity and current price',
        icon: <TrendingUp size={14} />,
      },
    ],
  },
  {
    id: 'options',
    name: 'Options',
    icon: <DollarSign size={16} />,
    color: 'bg-orange-500',
    nodes: [
      {
        id: 'option-leg',
        type: 'optionLeg',
        name: 'Option Leg',
        description: 'Call/Put option with strike, expiry, and quantity',
        icon: <DollarSign size={14} />,
      },
    ],
  },
  {
    id: 'entry-conditions',
    name: 'Entry Conditions',
    icon: <Play size={16} />,
    color: 'bg-purple-500',
    nodes: [
      {
        id: 'price-condition',
        type: 'priceCondition',
        name: 'Price Condition',
        description: 'Stock price above/below/between values',
        icon: <Activity size={14} />,
      },
      {
        id: 'technical-indicator',
        type: 'technicalIndicator',
        name: 'Technical Indicator',
        description: 'RSI, MACD, Moving Averages, etc.',
        icon: <BarChart3 size={14} />,
      },
    ],
  },
  {
    id: 'exit-conditions',
    name: 'Exit Conditions',
    icon: <Target size={16} />,
    color: 'bg-green-500',
    nodes: [
      {
        id: 'profit-target',
        type: 'profitTarget',
        name: 'Profit Target',
        description: 'Fixed $ or % gain target',
        icon: <Target size={14} />,
      },
      {
        id: 'stop-loss',
        type: 'stopLoss',
        name: 'Stop Loss',
        description: 'Fixed $ or % loss limit',
        icon: <Shield size={14} />,
      },
    ],
  },
  {
    id: 'risk-management',
    name: 'Risk Management',
    icon: <Shield size={16} />,
    color: 'bg-red-500',
    nodes: [
      {
        id: 'position-sizing',
        type: 'positionSizing',
        name: 'Position Sizing',
        description: 'Kelly Criterion, fixed %, risk parity',
        icon: <Calculator size={14} />,
      },
    ],
  },
  {
    id: 'execution',
    name: 'Execution',
    icon: <Zap size={16} />,
    color: 'bg-yellow-500',
    nodes: [
      {
        id: 'order-type',
        type: 'orderType',
        name: 'Order Type',
        description: 'Market, Limit, Stop orders',
        icon: <Settings size={14} />,
      },
    ],
  },
  {
    id: 'analysis',
    name: 'Analysis',
    icon: <BarChart3 size={16} />,
    color: 'bg-cyan-500',
    nodes: [
      {
        id: 'payoff-chart',
        type: 'payoffChart',
        name: 'Payoff Chart',
        description: 'P&L visualization for strategies',
        icon: <BarChart3 size={14} />,
      },
    ],
  },
];

const NodePalette: React.FC = () => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['market-data', 'options', 'entry-conditions'])
  );

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white mb-2">Node Palette</h2>
        <p className="text-sm text-gray-400">Drag nodes to the canvas to build your strategy</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {nodeCategories.map((category) => (
          <div key={category.id} className="mb-2">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1 rounded ${category.color}`}>
                  {category.icon}
                </div>
                <span className="font-medium text-white">{category.name}</span>
              </div>
              {expandedCategories.has(category.id) ? (
                <ChevronDown size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>
            
            <AnimatePresence>
              {expandedCategories.has(category.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 space-y-1 pl-2">
                    {category.nodes.map((node) => (
                      <div
                        key={node.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, node.type)}
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-grab active:cursor-grabbing transition-colors border border-gray-600 hover:border-gray-500"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-1 rounded-sm ${category.color} flex-shrink-0 mt-0.5`}>
                            {node.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white text-sm">{node.name}</h4>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                              {node.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          Professional Strategy Builder v1.0
        </div>
      </div>
    </div>
  );
};

export default NodePalette;
