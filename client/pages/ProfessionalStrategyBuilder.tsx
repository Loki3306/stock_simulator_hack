import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Node,
  Edge,
  Connection,
  ConnectionMode,
  NodeTypes,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Save, 
  Download, 
  Upload, 
  Undo, 
  Redo, 
  Settings, 
  ZoomIn, 
  ZoomOut,
  Grid3X3,
  Layers,
  BarChart3
} from 'lucide-react';

// Import our custom node types
import StockNode from '../components/strategy-builder/nodes/StockNode';
import OptionLegNode from '../components/strategy-builder/nodes/OptionLegNode';
import PriceConditionNode from '../components/strategy-builder/nodes/PriceConditionNode';
import TechnicalIndicatorNode from '../components/strategy-builder/nodes/TechnicalIndicatorNode';
import ProfitTargetNode from '../components/strategy-builder/nodes/ProfitTargetNode';
import StopLossNode from '../components/strategy-builder/nodes/StopLossNode';
import PositionSizingNode from '../components/strategy-builder/nodes/PositionSizingNode';
import OrderTypeNode from '../components/strategy-builder/nodes/OrderTypeNode';
import PayoffChartNode from '../components/strategy-builder/nodes/PayoffChartNode';

import NodePalette from '../components/strategy-builder/NodePalette';
import NodeEditor from '../components/strategy-builder/NodeEditor';
import StrategyMetrics from '../components/strategy-builder/StrategyMetrics';
import { useStrategyStore } from '../stores/strategyStore';

// Define node types
const nodeTypes: NodeTypes = {
  stock: StockNode,
  optionLeg: OptionLegNode,
  priceCondition: PriceConditionNode,
  technicalIndicator: TechnicalIndicatorNode,
  profitTarget: ProfitTargetNode,
  stopLoss: StopLossNode,
  positionSizing: PositionSizingNode,
  orderType: OrderTypeNode,
  payoffChart: PayoffChartNode,
};

// Custom edge styles
const edgeOptions = {
  animated: true,
  style: {
    stroke: '#8b5cf6',
    strokeWidth: 2,
  },
};

const connectionLineStyle = {
  stroke: '#8b5cf6',
  strokeWidth: 2,
};

const ProfessionalStrategyBuilder: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setSelectedNodeId, selectedNodeId } = useStrategyStore();
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [gridEnabled, setGridEnabled] = useState(true);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { strategyData, updateStrategy, exportStrategy, validateStrategy } = useStrategyStore();
  
  // Sync nodes and edges with store whenever they change
  React.useEffect(() => {
    updateStrategy(nodes, edges);
  }, [nodes, edges, updateStrategy]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, ...edgeOptions }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeType = event.dataTransfer.getData('application/reactflow');

      console.log('Drop event:', { nodeType, bounds: reactFlowBounds });

      if (typeof nodeType === 'undefined' || !nodeType || !reactFlowBounds) {
        console.log('Drop cancelled - missing data');
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const getDefaultNodeData = (type: string) => {
        switch (type) {
          case 'stock':
            return { symbol: 'AAPL', price: 150, quantity: 100 };
          case 'optionLeg':
            return { 
              symbol: 'AAPL', 
              strike: 150, 
              expiry: '2024-03-15', 
              type: 'call', 
              action: 'buy',
              quantity: 1 
            };
          case 'priceCondition':
            return { operator: 'greater_than', value: 150, timeframe: '1d' };
          case 'technicalIndicator':
            return { indicator: 'sma', period: 20, value: 150 };
          case 'profitTarget':
            return { type: 'percentage', value: 20 };
          case 'stopLoss':
            return { type: 'percentage', value: 10 };
          case 'positionSizing':
            return { method: 'fixed', value: 1000 };
          case 'orderType':
            return { type: 'market', timeInForce: 'DAY' };
          case 'payoffChart':
            return { chartType: 'P&L vs Price', maxProfit: null, maxLoss: null };
          default:
            return {};
        }
      };

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: getDefaultNodeData(nodeType),
      };

      console.log('Creating new node:', newNode);
      setNodes((nds) => {
        const updated = nds.concat(newNode);
        console.log('Updated nodes:', updated);
        return updated;
      });
    },
    [setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    console.log('Node clicked:', { 
      id: node.id, 
      type: node.type, 
      data: node.data,
      currentSelectedId: selectedNodeId 
    });
    setSelectedNodeId(node.id);
    setIsEditorOpen(true);
    console.log('After click - selectedNodeId should be:', node.id);
  }, [setSelectedNodeId, selectedNodeId]);

  const onSelectionChange = useCallback(({ nodes: selectedNodes }: { nodes: Node[] }) => {
    console.log('Selection changed:', selectedNodes);
    if (selectedNodes.length > 0) {
      const firstSelected = selectedNodes[0];
      setSelectedNodeId(firstSelected.id);
      setIsEditorOpen(true);
      console.log('Selection - setting selectedNodeId to:', firstSelected.id);
    } else {
      setSelectedNodeId(null);
      setIsEditorOpen(false);
    }
  }, [setSelectedNodeId]);

  const onPaneClick = useCallback(() => {
    console.log('Pane clicked - clearing selection');
    setSelectedNodeId(null);
    setIsEditorOpen(false);
  }, [setSelectedNodeId]);



  const handleExportStrategy = useCallback(() => {
    const strategy = exportStrategy(nodes, edges);
    const blob = new Blob([JSON.stringify(strategy, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategy-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges, exportStrategy]);

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">Professional Strategy Builder</h1>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Undo size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Redo size={18} />
            </button>
            <div className="w-px h-6 bg-gray-600" />
            <button 
              onClick={() => setGridEnabled(!gridEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                gridEnabled ? 'text-purple-400 bg-purple-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Grid3X3 size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <ZoomIn size={18} />
            </button>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <ZoomOut size={18} />
            </button>
            
            <div className="w-px h-6 bg-gray-600" />
            <button 
              onClick={() => {
                const testNode = {
                  id: 'test-stock-node',
                  type: 'stock',
                  position: { x: 100, y: 100 },
                  data: { symbol: 'AAPL', price: 150, quantity: 100 }
                };
                setNodes([testNode]);
                setSelectedNodeId(testNode.id);
                setIsEditorOpen(true);
                console.log('Created test node and opened editor');
              }}
              className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
            >
              Add Test Node
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2">
            <Play size={16} />
            <span>Backtest</span>
          </button>
          <button 
            onClick={handleExportStrategy}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2">
            <Save size={16} />
            <span>Save</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Node Palette */}
        <AnimatePresence>
          {isPaletteOpen && (
            <motion.div
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto"
            >
              <NodePalette />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Canvas */}
        <div className="flex-1 relative">
          <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="w-full h-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onSelectionChange={onSelectionChange}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                connectionLineStyle={connectionLineStyle}
                defaultEdgeOptions={edgeOptions}
                fitView
                attributionPosition="bottom-left"
              >
                <Controls
                  position="top-right"
                  style={{
                    background: '#374151',
                    border: '1px solid #4B5563',
                  }}
                />
                <MiniMap
                  position="bottom-right"
                  style={{
                    background: '#374151',
                    border: '1px solid #4B5563',
                  }}
                  nodeColor={(node) => {
                    switch (node.type) {
                      case 'stock': return '#3B82F6';
                      case 'optionLeg': return '#F59E0B';
                      case 'priceCondition':
                      case 'technicalIndicator': return '#8B5CF6';
                      case 'profitTarget':
                      case 'stopLoss': return '#10B981';
                      case 'positionSizing': return '#EF4444';
                      case 'orderType': return '#F59E0B';
                      case 'payoffChart': return '#06B6D4';
                      default: return '#6B7280';
                    }
                  }}
                />
                <Background
                  variant={gridEnabled ? BackgroundVariant.Dots : BackgroundVariant.Lines}
                  gap={20}
                  size={1}
                  color="#374151"
                />
              </ReactFlow>
            </div>
          </ReactFlowProvider>

          {/* Palette Toggle Button */}
          <button
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className="absolute top-4 left-4 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors z-10"
          >
            <Layers size={18} />
          </button>
        </div>

        {/* Right Sidebar - Node Editor */}
        <AnimatePresence>
          {isEditorOpen && (
            <motion.div
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto"
            >
              <NodeEditor 
                isOpen={isEditorOpen}
                onClose={() => {
                  console.log('Closing editor');
                  setIsEditorOpen(false);
                  setSelectedNodeId(null);
                }}
                nodes={nodes}
                onNodesChange={setNodes}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Panel - Strategy Metrics */}
      <div className="h-48 bg-gray-800 border-t border-gray-700 overflow-y-auto">
        <StrategyMetrics isOpen={true} />
      </div>
    </div>
  );
};

export default ProfessionalStrategyBuilder;
