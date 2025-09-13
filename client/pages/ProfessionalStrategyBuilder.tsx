import React, { useCallback, useState, useRef, useEffect } from 'react';
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
  FileUp,
  BarChart3,
  Copy,
  Clipboard,
  Map as MapIcon,
  Info,
  MousePointer2
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
import EdgeEditor from '../components/strategy-builder/EdgeEditor';
import StrategyMetrics from '../components/strategy-builder/StrategyMetrics';
import { useStrategyStore } from '../stores/strategyStore';
import { repo } from '../lib/mockRepo';
import { useToast } from '../hooks/use-toast';
import { StrategyMigration } from '../lib/migration';
import { SaveStrategyDialog } from '../components/strategy-builder/SaveStrategyDialog';
import { useAuth } from '../context/AuthContext';

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
  const { setSelectedNodeId, selectedNodeId, undo, redo, canUndo, canRedo, saveToHistory, 
          saveStrategyToDB, loadStrategyFromDB, updateStrategyInDB, currentDbStrategyId, 
          isLoading: strategyLoading, createNewStrategy, strategyData, setStrategyName, setStrategyDescription } = useStrategyStore();
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(true);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isEdgeEditorOpen, setIsEdgeEditorOpen] = useState(false);
  const [minimapPosition, setMinimapPosition] = useState({ x: 50, y: 100 });
  const [isDraggingMinimap, setIsDraggingMinimap] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showNodeLegend, setShowNodeLegend] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load strategy from localStorage on component mount (migration path)
  useEffect(() => {
    const loadStrategy = async () => {
      // Check if we have a strategy ID in URL params to load from DB
      const urlParams = new URLSearchParams(window.location.search);
      const strategyId = urlParams.get('strategyId');
      
      if (strategyId) {
        const success = await loadStrategyFromDB(strategyId);
        if (success) {
          const { strategyData } = useStrategyStore.getState();
          setNodes(strategyData.nodes);
          setEdges(strategyData.edges);
          console.log('Loaded strategy from database');
          return;
        }
      }
      
      // Check for migration
      if (StrategyMigration.checkForLocalStrategies() && !StrategyMigration.hasMigrated()) {
        try {
          const migrationSuccess = await StrategyMigration.performMigration();
          if (migrationSuccess) {
            toast({
              title: "Strategies Migrated",
              description: "Your local strategies have been migrated to the database.",
            });
          }
        } catch (error) {
          console.error('Migration failed:', error);
          toast({
            title: "Migration Warning",
            description: "Some strategies couldn't be migrated. They remain in local storage.",
            variant: "destructive",
          });
        }
      }
      
      // Fallback: Check localStorage for current session
      const savedStrategy = localStorage.getItem('currentStrategy');
      if (savedStrategy && !StrategyMigration.hasMigrated()) {
        try {
          const strategy = JSON.parse(savedStrategy);
          if (strategy.nodes) {
            setNodes(strategy.nodes);
          }
          if (strategy.edges) {
            setEdges(strategy.edges);
          }
          console.log('Loaded strategy from localStorage (fallback)');
          
        } catch (error) {
          console.error('Error loading strategy from localStorage:', error);
        }
      }
    };
    
    loadStrategy();
  }, []);

  // Update strategy store when nodes/edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      const store = useStrategyStore.getState();
      store.updateStrategy(nodes, edges);
    }
  }, [nodes, edges]);

  // Auto-save strategy to database when changes occur
  useEffect(() => {
    const autoSave = async () => {
      if ((nodes.length > 0 || edges.length > 0) && currentDbStrategyId) {
        // Only auto-save if we have an existing strategy in DB
        try {
          await updateStrategyInDB();
          console.log('Auto-saved strategy to database');
        } catch (error) {
          console.error('Auto-save failed:', error);
          // Fallback to localStorage for safety
          const strategy = {
            nodes,
            edges,
            timestamp: Date.now()
          };
          localStorage.setItem('currentStrategy', JSON.stringify(strategy));
        }
      } else if (nodes.length > 0 || edges.length > 0) {
        // Fallback to localStorage for unsaved strategies
        const strategy = {
          nodes,
          edges,
          timestamp: Date.now()
        };
        localStorage.setItem('currentStrategy', JSON.stringify(strategy));
        console.log('Auto-saved strategy to localStorage (unsaved strategy)');
      }
    };

    const timeoutId = setTimeout(autoSave, 2000); // Debounce auto-save
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, currentDbStrategyId, updateStrategyInDB]);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { exportStrategy, validateStrategy } = useStrategyStore();
  
  // Strategy management functions
  const handleSaveStrategy = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save your strategy.",
        variant: "destructive",
      });
      return;
    }

    // Update the strategy store with current nodes and edges first
    if (nodes.length > 0 || edges.length > 0) {
      const store = useStrategyStore.getState();
      store.updateStrategy(nodes, edges);
    }

    // Open the save dialog
    setShowSaveDialog(true);
  };

  const handleSaveDialogSave = async (data: {
    title: string;
    description: string;
    tags: string[];
    privacy: 'private' | 'public' | 'marketplace';
  }) => {
    try {
      // Update strategy metadata
      setStrategyName(data.title);
      setStrategyDescription(data.description);

      if (currentDbStrategyId) {
        // Update existing strategy
        const result = await updateStrategyInDB(data.tags, data.privacy);
        if (result) {
          toast({
            title: "Strategy Updated",
            description: "Your strategy has been saved successfully.",
          });
        }
      } else {
        // Save new strategy
        const result = await saveStrategyToDB(data.tags, data.privacy);
        if (result) {
          toast({
            title: "Strategy Saved",
            description: "Your strategy has been saved to your profile.",
          });
          // Update URL to include strategy ID
          const url = new URL(window.location.href);
          url.searchParams.set('strategyId', result._id);
          window.history.replaceState({}, '', url.toString());
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save strategy. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw to keep dialog open
    }
  };

  const handleNewStrategy = () => {
    createNewStrategy();
    setNodes([]);
    setEdges([]);
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
    toast({
      title: "New Strategy",
      description: "Started a new strategy.",
    });
  };
  
  // Function to create flowchart layout based on node connections
  const createFlowchartLayout = useCallback((nodes: any[], edges: any[]) => {
    if (nodes.length === 0) return nodes;
    
    // Build adjacency lists for input and output connections
    const outgoing = new Map(); // node -> [connected nodes]
    const incoming = new Map(); // node -> [source nodes]
    
    // Initialize maps
    nodes.forEach(node => {
      outgoing.set(node.id, []);
      incoming.set(node.id, []);
    });
    
    // Populate connection maps
    edges.forEach(edge => {
      if (outgoing.has(edge.from) && incoming.has(edge.to)) {
        outgoing.get(edge.from).push(edge.to);
        incoming.get(edge.to).push(edge.from);
      }
    });
    
    // Find root nodes (no incoming connections) and leaf nodes (no outgoing connections)
    const rootNodes = nodes.filter(node => incoming.get(node.id).length === 0);
    const leafNodes = nodes.filter(node => outgoing.get(node.id).length === 0);
    
    // If no clear hierarchy, fallback to intelligent grid
    if (rootNodes.length === 0 || rootNodes.length === nodes.length) {
      return createIntelligentGrid(nodes, edges);
    }
    
    // Perform hierarchical layout
    const positioned = new Map();
    const layers = [];
    
    // BFS to create layers
    const visited = new Set();
    let currentLayer = [...rootNodes];
    layers.push([...currentLayer]);
    
    currentLayer.forEach(node => {
      visited.add(node.id);
      positioned.set(node.id, { layer: 0, order: layers[0].indexOf(node) });
    });
    
    let layerIndex = 1;
    while (currentLayer.length > 0) {
      const nextLayer = [];
      currentLayer.forEach(node => {
        outgoing.get(node.id).forEach(targetId => {
          if (!visited.has(targetId)) {
            const targetNode = nodes.find(n => n.id === targetId);
            if (targetNode) {
              nextLayer.push(targetNode);
              visited.add(targetId);
            }
          }
        });
      });
      
      if (nextLayer.length > 0) {
        layers.push([...nextLayer]);
        nextLayer.forEach((node, order) => {
          positioned.set(node.id, { layer: layerIndex, order });
        });
        layerIndex++;
      }
      
      currentLayer = nextLayer;
    }
    
    // Handle any unvisited nodes (isolated nodes)
    const unvisited = nodes.filter(node => !visited.has(node.id));
    if (unvisited.length > 0) {
      layers.push(unvisited);
      unvisited.forEach((node, order) => {
        positioned.set(node.id, { layer: layerIndex, order });
      });
    }
    
    // Calculate positions based on layers
    const layerHeight = 200;
    const nodeWidth = 220;
    const baseX = 100;
    const baseY = 80;
    
    return nodes.map(node => {
      const pos = positioned.get(node.id) || { layer: 0, order: 0 };
      const layerNodes = layers[pos.layer] || [node];
      const layerWidth = layerNodes.length * nodeWidth;
      const startX = baseX + (pos.layer * 50); // Slight offset per layer for better flow
      
      // Center nodes in each layer
      const x = startX + (pos.order * nodeWidth) - (layerWidth / 2) + (layerWidth / layerNodes.length / 2);
      const y = baseY + (pos.layer * layerHeight);
      
      return {
        ...node,
        position: { x, y }
      };
    });
  }, []);
  
  // Fallback intelligent grid for complex graphs
  const createIntelligentGrid = useCallback((nodes: any[], edges: any[]) => {
    // Group nodes by type for better organization
    const nodesByType = new Map();
    nodes.forEach(node => {
      const type = node.type || 'unknown';
      if (!nodesByType.has(type)) {
        nodesByType.set(type, []);
      }
      nodesByType.get(type).push(node);
    });
    
    // Define type order for logical flow
    const typeOrder = ['data', 'indicator', 'condition', 'signal', 'action', 'execution', 'risk', 'option'];
    const sortedTypes = [];
    
    // Add types in preferred order
    typeOrder.forEach(type => {
      if (nodesByType.has(type)) {
        sortedTypes.push({ type, nodes: nodesByType.get(type) });
        nodesByType.delete(type);
      }
    });
    
    // Add any remaining types
    nodesByType.forEach((nodes, type) => {
      sortedTypes.push({ type, nodes });
    });
    
    // Layout nodes in columns by type
    const columnWidth = 280;
    const rowHeight = 150;
    const baseX = 100;
    const baseY = 100;
    
    const positioned = [];
    let currentX = baseX;
    
    sortedTypes.forEach(({ type, nodes }) => {
      nodes.forEach((node, index) => {
        positioned.push({
          ...node,
          position: {
            x: currentX,
            y: baseY + (index * rowHeight)
          }
        });
      });
      currentX += columnWidth;
    });
    
    return positioned;
  }, []);

  // Function to add spacing to imported nodes (now uses flowchart layout)
  const addNodeSpacing = useCallback((nodes: any[], edges: any[] = []) => {
    if (nodes.length === 0) return nodes;
    
    // Use flowchart layout for better organization
    return createFlowchartLayout(nodes, edges);
  }, [createFlowchartLayout]);
  
  // Load imported strategy on component mount
  useEffect(() => {
    const importedStrategyId = localStorage.getItem('imported_strategy_id');
    if (importedStrategyId) {
      const importedStrategy = repo.getStrategy(importedStrategyId);
      if (importedStrategy && importedStrategy.nodes && importedStrategy.edges) {
        // Convert the stored nodes to React Flow format
        const flowNodes = importedStrategy.nodes.map(node => {
          let nodeType = 'stock'; // default fallback
          
          // Map strategy node types to React Flow node types
          switch (node.type) {
            case 'indicator':
              nodeType = 'technicalIndicator';
              break;
            case 'condition':
              nodeType = 'priceCondition';
              break;
            case 'action':
              nodeType = 'orderType'; // Use orderType for actions like BUY/SELL
              break;
            case 'option':
              nodeType = 'optionLeg';
              break;
            default:
              nodeType = 'stock'; // fallback to stock node
          }

          // Get the color for this node type
          const nodeColors = {
            stock: { bg: '#1E40AF', border: '#3B82F6' },
            optionLeg: { bg: '#D97706', border: '#F59E0B' },
            technicalIndicator: { bg: '#059669', border: '#10B981' },
            priceCondition: { bg: '#DC2626', border: '#EF4444' },
            profitTarget: { bg: '#16A34A', border: '#22C55E' },
            stopLoss: { bg: '#B91C1C', border: '#DC2626' },
            positionSizing: { bg: '#9333EA', border: '#A855F7' },
            orderType: { bg: '#EA580C', border: '#FB923C' },
            payoffChart: { bg: '#0891B2', border: '#06B6D4' }
          };

          const colors = nodeColors[nodeType as keyof typeof nodeColors] || nodeColors.stock;
          
          return {
            id: node.id,
            type: nodeType,
            position: node.position,
            style: {
              background: `linear-gradient(135deg, ${colors.bg}, ${colors.border})`,
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              color: 'white',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
              minWidth: '150px',
              padding: '8px'
            },
            data: {
              ...node.parameters,
              blockType: node.blockType,
              label: node.blockType || node.type,
            },
          };
        });
        
        // Convert edges to React Flow format
        const flowEdges = importedStrategy.edges.map(edge => ({
          id: `${edge.from}-${edge.to}`,
          source: edge.from,
          target: edge.to,
          ...edgeOptions,
        }));
        
        // Apply spacing to nodes using flowchart layout
        const spacedNodes = addNodeSpacing(flowNodes, flowEdges);
        
        setNodes(spacedNodes);
        setEdges(flowEdges);
        saveToHistory(spacedNodes, flowEdges);
        
        // Clear the imported strategy ID so it doesn't reload on refresh
        localStorage.removeItem('imported_strategy_id');
        
        // Set strategy name and description from imported marketplace strategy
        if (importedStrategy.title) {
          setStrategyName(`${importedStrategy.title} (Copy)`);
        }
        if (importedStrategy.description) {
          setStrategyDescription(importedStrategy.description);
        }
        
        console.log('Loaded imported strategy:', importedStrategy.title, {
          nodes: flowNodes.length,
          edges: flowEdges.length
        });
      }
    }
  }, [setNodes, setEdges, saveToHistory]);
  
  // Remove the automatic sync that was causing infinite loops
  // We'll update the store manually when needed
  
  // Undo/Redo functionality
  const handleUndo = useCallback(() => {
    const result = undo();
    if (result) {
      setNodes(result.nodes);
      setEdges(result.edges);
    }
  }, [undo, setNodes, setEdges]);
  
  const handleRedo = useCallback(() => {
    const result = redo();
    if (result) {
      setNodes(result.nodes);
      setEdges(result.edges);
    }
  }, [redo, setNodes, setEdges]);
  
  // Save to history when nodes/edges change (debounced)
  const saveStateToHistory = useCallback(() => {
    if (nodes.length > 0 || edges.length > 0) {
      saveToHistory(nodes, edges);
    }
  }, [nodes, edges, saveToHistory]);
  
  // Import strategy functionality
  const handleImportStrategy = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedStrategy = JSON.parse(event.target?.result as string);
            
            // Validate the imported strategy has the required structure
            if (importedStrategy.nodes && importedStrategy.edges) {
              // Apply spacing to imported nodes using flowchart layout
              const spacedNodes = addNodeSpacing(importedStrategy.nodes, importedStrategy.edges);
              setNodes(spacedNodes);
              setEdges(importedStrategy.edges);
              saveToHistory(spacedNodes, importedStrategy.edges);
              
              // Set strategy name and description from imported data
              if (importedStrategy.title || importedStrategy.name) {
                setStrategyName(importedStrategy.title || importedStrategy.name);
              }
              if (importedStrategy.description) {
                setStrategyDescription(importedStrategy.description);
              }
              
              console.log('Strategy imported successfully:', importedStrategy);
            } else {
              alert('Invalid strategy file format');
            }
          } catch (error) {
            console.error('Error importing strategy:', error);
            alert('Error reading strategy file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, [setNodes, setEdges, saveToHistory]);
  
  // Export strategy functionality
  const handleExportStrategy = useCallback(() => {
    const strategy = {
      id: `strategy-${Date.now()}`,
      name: `Strategy ${new Date().toLocaleDateString()}`,
      description: 'Exported strategy',
      nodes,
      edges,
      metadata: {
        created: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        version: 1,
      }
    };
    
    const blob = new Blob([JSON.stringify(strategy, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `strategy-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);
  
  // Clear strategy functionality
  const handleClearStrategy = useCallback(() => {
    setNodes([]);
    setEdges([]);
    localStorage.removeItem('currentStrategy');
    setSelectedNodeId(null);
    setIsEditorOpen(false);
    setIsEdgeEditorOpen(false);
    console.log('Cleared strategy and localStorage');
  }, [setNodes, setEdges, setSelectedNodeId]);
  
  // Copy/Paste functionality
  const handleCopyNodes = useCallback(() => {
    const selectedNodes = nodes.filter(node => node.selected);
    if (selectedNodes.length > 0) {
      setCopiedNodes(selectedNodes);
      console.log('Copied nodes:', selectedNodes.map(n => n.id));
    }
  }, [nodes]);
  
  const handlePasteNodes = useCallback(() => {
    if (copiedNodes.length > 0) {
      const newNodes = copiedNodes.map(node => ({
        ...node,
        id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
        selected: false,
      }));
      
      setNodes(nds => [...nds, ...newNodes]);
      saveToHistory([...nodes, ...newNodes], edges);
      console.log('Pasted nodes:', newNodes.map(n => n.id));
    }
  }, [copiedNodes, setNodes, nodes, edges, saveToHistory]);
  
  const handleDeleteSelected = useCallback(() => {
    const selectedNodeIds = nodes.filter(node => node.selected).map(node => node.id);
    const selectedEdgeIds = edges.filter(edge => edge.selected).map(edge => edge.id);
    
    if (selectedNodeIds.length > 0 || selectedEdgeIds.length > 0) {
      const newNodes = nodes.filter(node => !selectedNodeIds.includes(node.id));
      const newEdges = edges.filter(edge => 
        !selectedEdgeIds.includes(edge.id) && 
        !selectedNodeIds.includes(edge.source) && 
        !selectedNodeIds.includes(edge.target)
      );
      
      setNodes(newNodes);
      setEdges(newEdges);
      saveToHistory(newNodes, newEdges);
      setSelectedNodeId(null);
      setIsEditorOpen(false);
      console.log('Deleted nodes:', selectedNodeIds, 'edges:', selectedEdgeIds);
    }
  }, [nodes, edges, setNodes, setEdges, saveToHistory, setSelectedNodeId]);

  // Edit edge connections
  const handleEditEdge = useCallback((edgeId: string, newSource?: string, newTarget?: string) => {
    setEdges(eds => eds.map(edge => {
      if (edge.id === edgeId) {
        const updatedEdge = {
          ...edge,
          ...(newSource && { source: newSource }),
          ...(newTarget && { target: newTarget }),
        };
        // Update the edge ID to reflect new connection
        if (newSource || newTarget) {
          updatedEdge.id = `${updatedEdge.source}-${updatedEdge.target}`;
        }
        return updatedEdge;
      }
      return edge;
    }));
    
    saveToHistory(nodes, edges);
  }, [setEdges, nodes, edges, saveToHistory]);

  // Delete selected edge
  const handleDeleteEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges(eds => eds.filter(edge => edge.id !== selectedEdge.id));
      saveToHistory(nodes, edges.filter(edge => edge.id !== selectedEdge.id));
      setSelectedEdge(null);
      setIsEdgeEditorOpen(false);
    }
  }, [selectedEdge, setEdges, nodes, edges, saveToHistory]);

  // Get node color based on type and state
  const getNodeColor = useCallback((node: Node) => {
    const baseColors = {
      stock: '#3B82F6',           // Bright Blue - Stock related
      optionLeg: '#F59E0B',       // Bright Orange - Options
      priceCondition: '#EF4444',  // Bright Red - Conditions  
      technicalIndicator: '#10B981', // Bright Green - Technical Analysis
      profitTarget: '#22C55E',    // Lime Green - Profit
      stopLoss: '#DC2626',        // Dark Red - Risk Management
      positionSizing: '#A855F7',  // Bright Purple - Position Management
      orderType: '#FB923C',       // Light Orange - Orders
      payoffChart: '#06B6D4',     // Bright Cyan - Analytics
      default: '#6B7280'          // Gray - Default
    };
    
    let color = baseColors[node.type as keyof typeof baseColors] || baseColors.default;
    
    // Modify color based on node state
    if (node.selected) {
      // Make selected nodes brighter
      return color;
    }
    
    return color;
  }, []);

  // Handle minimap drag
  const handleMinimapMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) return; // Only drag from minimap container
    setIsDraggingMinimap(true);
    e.preventDefault();
  }, []);

  const handleMinimapMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingMinimap) return;
    
    setMinimapPosition(prev => ({
      x: Math.max(10, Math.min(window.innerWidth - 200, prev.x + e.movementX)),
      y: Math.max(10, Math.min(window.innerHeight - 150, prev.y + e.movementY))
    }));
  }, [isDraggingMinimap]);

  const handleMinimapMouseUp = useCallback(() => {
    setIsDraggingMinimap(false);
  }, []);

  // Add event listeners for minimap dragging
  useEffect(() => {
    if (isDraggingMinimap) {
      document.addEventListener('mousemove', handleMinimapMouseMove);
      document.addEventListener('mouseup', handleMinimapMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMinimapMouseMove);
        document.removeEventListener('mouseup', handleMinimapMouseUp);
      };
    }
  }, [isDraggingMinimap, handleMinimapMouseMove, handleMinimapMouseUp]);
  
  // Select all nodes functionality
  const handleSelectAll = useCallback(() => {
    const totalNodes = nodes.length;
    if (totalNodes === 0) return;
    
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        selected: true,
      }))
    );
    setEdges((eds) => 
      eds.map((edge) => ({
        ...edge,
        selected: false, // Keep edges unselected to avoid visual clutter
      }))
    );
    
    console.log(`Selected all ${totalNodes} nodes`);
  }, [nodes.length, setNodes, setEdges]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if ((event.ctrlKey || event.metaKey)) {
        switch (event.key) {
          case 'a':
            event.preventDefault();
            handleSelectAll();
            break;
          case 'z':
            if (event.shiftKey) {
              event.preventDefault();
              handleRedo();
            } else {
              event.preventDefault();
              handleUndo();
            }
            break;
          case 'y':
            event.preventDefault();
            handleRedo();
            break;
          case 's':
            event.preventDefault();
            saveStateToHistory();
            break;
          case 'c':
            event.preventDefault();
            handleCopyNodes();
            break;
          case 'v':
            event.preventDefault();
            handlePasteNodes();
            break;
        }
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        handleDeleteSelected();
      } else if (event.key === 'Escape') {
        // Deselect all nodes and edges when Escape is pressed
        event.preventDefault();
        setNodes((nds) => nds.map((node) => ({ ...node, selected: false })));
        setEdges((eds) => eds.map((edge) => ({ ...edge, selected: false })));
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, saveStateToHistory, handleCopyNodes, handlePasteNodes, handleDeleteSelected, handleSelectAll, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, ...edgeOptions }, eds)),
    [setEdges]
  );

  // Handle node selection with multi-select support
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select mode
      setNodes(nds => nds.map(n => 
        n.id === node.id 
          ? { ...n, selected: !n.selected }
          : n
      ));
    } else {
      // Single select mode
      setNodes(nds => nds.map(n => ({
        ...n,
        selected: n.id === node.id
      })));
      
      setSelectedNodeId(node.id);
      setIsEditorOpen(true);
      setIsEdgeEditorOpen(false);
      setSelectedEdge(null);
    }
  }, [setNodes, setSelectedNodeId]);

  // Handle edge selection
  const onEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
    
    // Deselect all nodes
    setNodes(nds => nds.map(n => ({ ...n, selected: false })));
    
    // Select the clicked edge
    setEdges(eds => eds.map(e => ({
      ...e,
      selected: e.id === edge.id
    })));
    
    setSelectedEdge(edge);
    setIsEdgeEditorOpen(true);
    setIsEditorOpen(false);
    setSelectedNodeId(null);
  }, [setNodes, setEdges, setSelectedNodeId]);

  // Handle canvas click to deselect all
  const onPaneClick = useCallback(() => {
    setNodes(nds => nds.map(n => ({ ...n, selected: false })));
    setEdges(eds => eds.map(e => ({ ...e, selected: false })));
    setSelectedNodeId(null);
    setSelectedEdge(null);
    setIsEditorOpen(false);
    setIsEdgeEditorOpen(false);
  }, [setNodes, setEdges, setSelectedNodeId]);

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

  const onSelectionChange = useCallback(({ nodes: selectedNodes, edges: selectedEdges }: { nodes: Node[], edges: Edge[] }) => {
    console.log('Selection changed:', { nodes: selectedNodes.length, edges: selectedEdges.length });
    
    if (selectedEdges.length > 0) {
      // Edge selected
      const firstSelectedEdge = selectedEdges[0];
      setSelectedEdge(firstSelectedEdge);
      setIsEdgeEditorOpen(true);
      setIsEditorOpen(false);
      setSelectedNodeId(null);
    } else if (selectedNodes.length === 1) {
      // Single node selected
      const firstSelected = selectedNodes[0];
      setSelectedNodeId(firstSelected.id);
      setIsEditorOpen(true);
      setIsEdgeEditorOpen(false);
      setSelectedEdge(null);
    } else if (selectedNodes.length > 1) {
      // Multiple nodes selected - no editor, just visual feedback
      setSelectedNodeId(null);
      setIsEditorOpen(false);
      setIsEdgeEditorOpen(false);
      setSelectedEdge(null);
    } else {
      // Nothing selected
      setSelectedNodeId(null);
      setSelectedEdge(null);
      setIsEditorOpen(false);
      setIsEdgeEditorOpen(false);
    }
  }, [setSelectedNodeId]);

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      {/* Top Toolbar */}
      <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">Professional Strategy Builder</h1>
          
          {/* Selection Status */}
          {(() => {
            const selectedNodeCount = nodes.filter(n => n.selected).length;
            const selectedEdgeCount = edges.filter(e => e.selected).length;
            
            if (selectedNodeCount > 1) {
              return (
                <div className="px-3 py-1 bg-purple-900/30 border border-purple-500/30 rounded-lg">
                  <span className="text-sm text-purple-300">
                    {selectedNodeCount} nodes selected
                  </span>
                </div>
              );
            } else if (selectedEdgeCount > 0) {
              return (
                <div className="px-3 py-1 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                  <span className="text-sm text-blue-300">
                    {selectedEdgeCount} connection{selectedEdgeCount > 1 ? 's' : ''} selected
                  </span>
                </div>
              );
            }
            return null;
          })()}
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleUndo}
              disabled={!canUndo()}
              className={`p-2 rounded-lg transition-colors ${
                canUndo() 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo size={18} />
            </button>
            <button 
              onClick={handleRedo}
              disabled={!canRedo()}
              className={`p-2 rounded-lg transition-colors ${
                canRedo() 
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo size={18} />
            </button>
            
            <div className="w-px h-6 bg-gray-600" />
            
            <button 
              onClick={handleSaveStrategy}
              disabled={strategyLoading}
              className={`p-2 rounded-lg transition-colors ${
                strategyLoading
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-green-400 hover:text-green-300 hover:bg-green-900/20'
              }`}
              title={currentDbStrategyId ? "Update Strategy" : "Save Strategy"}
            >
              <Save size={18} />
            </button>
            
            <button 
              onClick={handleNewStrategy}
              className="p-2 rounded-lg text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 transition-colors"
              title="New Strategy"
            >
              <FileUp size={18} />
            </button>
            
            <div className="w-px h-6 bg-gray-600" />
            <button 
              onClick={handleCopyNodes}
              disabled={nodes.filter(n => n.selected).length === 0}
              className={`p-2 rounded-lg transition-colors ${
                nodes.filter(n => n.selected).length > 0
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Copy Selected (Ctrl+C)"
            >
              <Copy size={18} />
            </button>
            <button 
              onClick={handlePasteNodes}
              disabled={copiedNodes.length === 0}
              className={`p-2 rounded-lg transition-colors ${
                copiedNodes.length > 0
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Paste (Ctrl+V)"
            >
              <Clipboard size={18} />
            </button>
            <button 
              onClick={handleSelectAll}
              disabled={nodes.length === 0}
              className={`p-2 rounded-lg transition-colors ${
                nodes.length > 0
                  ? 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20' 
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Select All (Ctrl+A)"
            >
              <MousePointer2 size={18} />
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
            {/* Minimap toggle removed - minimap disabled */}
            {/* <button 
              onClick={() => setShowMinimap(!showMinimap)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                showMinimap 
                  ? 'text-blue-400 bg-blue-900/30 border border-blue-500/50 shadow-lg shadow-blue-500/20' 
                  : 'text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 border border-transparent'
              }`}
              title={showMinimap ? "Hide Minimap" : "Show Minimap"}
            >
              <MapIcon size={18} />
            </button> */}
            <button 
              onClick={() => setShowNodeLegend(!showNodeLegend)}
              className={`p-2 rounded-lg transition-colors ${
                showNodeLegend ? 'text-green-400 bg-green-900/20' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
              title="Toggle Node Legend"
            >
              <Info size={18} />
            </button>
            
            <div className="w-px h-6 bg-gray-600" />
            <button 
              onClick={() => {
                const testNode = {
                  id: `test-stock-node-${Date.now()}`,
                  type: 'stock',
                  position: { x: 100, y: 100 },
                  data: { symbol: 'AAPL', price: 150, quantity: 100 }
                };
                setNodes((nds) => [...nds, testNode]);
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
          <button 
            onClick={handleImportStrategy}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <FileUp size={16} />
            <span>Import</span>
          </button>
          <button 
            onClick={saveStateToHistory}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save</span>
          </button>
          <button 
            onClick={handleClearStrategy}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Redo size={16} />
            <span>Clear</span>
          </button>
          <button 
            onClick={() => setIsAnalyticsOpen(!isAnalyticsOpen)}
            className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center space-x-2 ${
              isAnalyticsOpen 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
            title={isAnalyticsOpen ? "Hide Analytics" : "Show Analytics"}
          >
            <BarChart3 size={16} />
            <span>{isAnalyticsOpen ? 'Hide' : 'Show'} Analytics</span>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar - Node Palette */}
        <AnimatePresence>
          {isPaletteOpen && (
            <motion.div
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto flex-shrink-0"
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
                onEdgeClick={onEdgeClick}
                onSelectionChange={onSelectionChange}
                onPaneClick={onPaneClick}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                connectionLineStyle={connectionLineStyle}
                defaultEdgeOptions={edgeOptions}
                multiSelectionKeyCode="Control"
                panOnDrag={true}
                panOnScroll={false}
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                selectionOnDrag={false}
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
                
                {/* Custom Movable Minimap */}
                {showMinimap && (
                  <div
                    style={{
                      position: 'absolute',
                      left: minimapPosition.x,
                      top: minimapPosition.y,
                      zIndex: 1000,
                      cursor: isDraggingMinimap ? 'grabbing' : 'grab',
                      userSelect: 'none'
                    }}
                    onMouseDown={handleMinimapMouseDown}
                    className="minimap-container"
                  >
                    <div className="bg-gray-900 rounded-lg border-2 border-blue-500/50 p-3 shadow-2xl backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-400 font-semibold flex items-center">
                          <MapIcon size={14} className="mr-1" />
                          Minimap
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setMinimapPosition({ x: 50, y: 100 })}
                            className="text-xs text-gray-400 hover:text-blue-400 bg-gray-800 px-2 py-1 rounded transition-colors"
                            title="Reset Position"
                          >
                            ↺
                          </button>
                          <button
                            onClick={() => setShowMinimap(false)}
                            className="text-xs text-gray-400 hover:text-red-400 bg-gray-800 px-2 py-1 rounded transition-colors"
                            title="Hide Minimap"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      <MiniMap
                        style={{
                          background: '#0F172A',
                          border: '2px solid #3B82F6',
                          borderRadius: '8px',
                          width: '200px',
                          height: '140px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                        }}
                        nodeColor={getNodeColor}
                        maskColor="rgba(0, 0, 0, 0.4)"
                        nodeStrokeWidth={3}
                        nodeStrokeColor="#ffffff"
                        pannable
                        zoomable
                      />
                    </div>
                  </div>
                )}

                {/* Node Type Legend */}
                {showNodeLegend && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 20,
                      top: 20,
                      zIndex: 1000,
                    }}
                    className="bg-gray-800 rounded-lg border border-gray-600 p-3 shadow-lg max-w-xs"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-300 font-medium">Node Types</span>
                      <button
                        onClick={() => setShowNodeLegend(false)}
                        className="text-xs text-gray-400 hover:text-white"
                        title="Hide Legend"
                      >
                        ×
                      </button>
                    </div>
                    <div className="space-y-2 text-xs">
                      {[
                        { type: 'stock', label: 'Stock', color: '#3B82F6' },
                        { type: 'optionLeg', label: 'Options', color: '#F59E0B' },
                        { type: 'technicalIndicator', label: 'Technical Analysis', color: '#10B981' },
                        { type: 'priceCondition', label: 'Conditions', color: '#EF4444' },
                        { type: 'profitTarget', label: 'Profit Target', color: '#22C55E' },
                        { type: 'stopLoss', label: 'Stop Loss', color: '#DC2626' },
                        { type: 'positionSizing', label: 'Position Size', color: '#A855F7' },
                        { type: 'orderType', label: 'Order Type', color: '#FB923C' },
                        { type: 'payoffChart', label: 'Analytics', color: '#06B6D4' },
                      ].map(({ type, label, color }) => (
                        <div key={type} className="flex items-center space-x-2">
                          <div
                            className="w-4 h-4 rounded border-2 border-gray-400"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-gray-300">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
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
          {(isEditorOpen || isEdgeEditorOpen) && (
            <motion.div
              initial={{ x: 350, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 350, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto"
            >
              {isEditorOpen && (
                <NodeEditor 
                  isOpen={isEditorOpen}
                  onClose={() => {
                    console.log('Closing node editor');
                    setIsEditorOpen(false);
                    setSelectedNodeId(null);
                  }}
                  nodes={nodes}
                  onNodesChange={setNodes}
                />
              )}
              
              {isEdgeEditorOpen && selectedEdge && (
                <EdgeEditor
                  edge={selectedEdge}
                  nodes={nodes}
                  onUpdateEdge={handleEditEdge}
                  onDeleteEdge={handleDeleteEdge}
                  onClose={() => {
                    console.log('Closing edge editor');
                    setIsEdgeEditorOpen(false);
                    setSelectedEdge(null);
                  }}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Panel - Strategy Metrics */}
      {isAnalyticsOpen && (
        <div className="h-80 bg-gray-800 border-t border-gray-700 overflow-y-auto">
          <StrategyMetrics isOpen={true} nodes={nodes} edges={edges} />
        </div>
      )}

      {/* Save Strategy Dialog */}
      <SaveStrategyDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        onSave={handleSaveDialogSave}
        currentTitle={strategyData.name}
        currentDescription={strategyData.description}
        currentTags={[]}
        isUpdating={!!currentDbStrategyId}
      />
    </div>
  );
};

export default ProfessionalStrategyBuilder;
