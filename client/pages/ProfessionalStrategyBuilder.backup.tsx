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
  MousePointer2,
  CheckCircle,
  AlertTriangle
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
import { Badge } from '../components/ui/badge';
import { useStrategyStore } from '../stores/strategyStore';
import { toast } from '../hooks/use-toast';
import { repo } from '../lib/mockRepo';

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
  const { setSelectedNodeId, selectedNodeId, undo, redo, canUndo, canRedo, saveToHistory } = useStrategyStore();
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(420);
  const [gridEnabled, setGridEnabled] = useState(true);
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [isEdgeEditorOpen, setIsEdgeEditorOpen] = useState(false);
  const [minimapPosition, setMinimapPosition] = useState({ x: 50, y: 100 });
  const [isDraggingMinimap, setIsDraggingMinimap] = useState(false);
  const [showMinimap, setShowMinimap] = useState(false);
  const [showNodeLegend, setShowNodeLegend] = useState(false);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const didLoadImportedRef = useRef(false);
  const { strategyData, exportStrategy, validateStrategy } = useStrategyStore();
  const runBacktest = useStrategyStore(s => s.runBacktest);
  
  // Function to create flowchart layout based on node connections
  const createFlowchartLayout = useCallback((nodes: any[], edges: any[]) => {
    if (nodes.length === 0) return nodes;

    // Build adjacency lists for input and output connections
    const nodeById = new Map<string, any>();
    nodes.forEach(n => nodeById.set(n.id, n));

    const outgoing = new Map<string, string[]>();
    const incoming = new Map<string, string[]>();
    nodes.forEach(n => {
      outgoing.set(n.id, []);
      incoming.set(n.id, []);
    });

    edges.forEach(edge => {
      const fromId = (edge as any).from ?? (edge as any).source;
      const toId = (edge as any).to ?? (edge as any).target;
      if (fromId && toId && outgoing.has(fromId) && incoming.has(toId)) {
        outgoing.get(fromId)!.push(toId);
        incoming.get(toId)!.push(fromId);
      }
    });

    // Identify root nodes (no incoming)
    const roots = nodes.filter(n => (incoming.get(n.id) || []).length === 0);
    if (roots.length === 0 || roots.length === nodes.length) {
      return createIntelligentGrid(nodes, edges);
    }

    // BFS to assign levels (distance from any root)
    const level = new Map<string, number>();
    const q: string[] = [];
    const visited = new Set<string>();
    roots.forEach(r => { level.set(r.id, 0); q.push(r.id); visited.add(r.id); });

    while (q.length > 0) {
      const id = q.shift()!;
      const lvl = level.get(id)!;
      (outgoing.get(id) || []).forEach(nb => {
        if (!visited.has(nb)) {
          level.set(nb, lvl + 1);
          visited.add(nb);
          q.push(nb);
        } else {
          // keep smallest level if already set
          const existing = level.get(nb) ?? Infinity;
          level.set(nb, Math.min(existing, lvl + 1));
        }
      });
    }

    // Ensure all nodes have a level
    let maxLevel = 0;
    nodes.forEach(n => {
      if (!level.has(n.id)) {
        level.set(n.id, maxLevel + 1);
        maxLevel++;
      } else {
        maxLevel = Math.max(maxLevel, level.get(n.id)!);
      }
    });

    // Group nodes by level into layers
    const layers: string[][] = [];
    nodes.forEach(n => {
      const l = level.get(n.id) || 0;
      layers[l] = layers[l] || [];
      layers[l].push(n.id);
    });

    // Order nodes within layers using barycenter heuristic to reduce edge crossings
    const iterations = 3;
    for (let it = 0; it < iterations; it++) {
      for (let li = 1; li < layers.length; li++) {
        const prev = layers[li - 1];
        const cur = layers[li];
        const indexMap = new Map<string, number>();
        prev.forEach((id, idx) => indexMap.set(id, idx));

        cur.sort((a, b) => {
          const parentsA = (incoming.get(a) || []).filter(p => indexMap.has(p)).map(p => indexMap.get(p)!);
          const parentsB = (incoming.get(b) || []).filter(p => indexMap.has(p)).map(p => indexMap.get(p)!);
          const avgA = parentsA.length ? (parentsA.reduce((s, v) => s + v, 0) / parentsA.length) : Infinity;
          const avgB = parentsB.length ? (parentsB.reduce((s, v) => s + v, 0) / parentsB.length) : Infinity;
          return avgA - avgB;
        });
      }
    }

    // Compute positions: left-to-right layers, vertical spacing per layer
    const layerSpacingX = 360;
    const verticalSpacing = 160;
    const baseX = 120;
    const baseY = 120;

    const positioned: Record<string, { x: number; y: number }> = {};
    layers.forEach((layerIds, li) => {
      const layerCount = layerIds.length;
      const totalHeight = (layerCount - 1) * verticalSpacing;
      layerIds.forEach((id, idx) => {
        const x = baseX + li * layerSpacingX;
        const y = baseY + idx * verticalSpacing - totalHeight / 2;
        positioned[id] = { x, y };
      });
    });

    // Return nodes with assigned positions
    return nodes.map(n => ({ ...n, position: positioned[n.id] || n.position || { x: baseX, y: baseY } }));
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
    // 1) If user explicitly imported a strategy from repo
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
        
        // If imported nodes include explicit positions, preserve them.
        // Only apply automatic spacing for nodes that lack a valid position.
        const nodesWithPositions = flowNodes.map(n => {
          if (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number') {
            return n;
          }
          return null;
        });

        const nodesMissingPos = flowNodes.filter((n, i) => nodesWithPositions[i] === null);
        const spacedForMissing = nodesMissingPos.length > 0 ? addNodeSpacing(nodesMissingPos, flowEdges) : [];

        // Merge preserved positions and generated positions
        const mergedNodes = flowNodes.map(n => {
          const found = spacedForMissing.find(fn => fn.id === n.id);
          return found ? found : n;
        });

  setNodes(mergedNodes);
  didLoadImportedRef.current = true;
  setEdges(flowEdges);
  saveToHistory(mergedNodes, flowEdges);
        
        // Clear the imported strategy ID so it doesn't reload on refresh
  localStorage.removeItem('imported_strategy_id');
        
        console.log('Loaded imported strategy:', importedStrategy.title, {
          nodes: flowNodes.length,
          edges: flowEdges.length
        });
      }
    }
  }, [setNodes, setEdges, saveToHistory]);

  // 2) Autosave current layout to localStorage so leaving the page preserves it
  useEffect(() => {
    const key = 'psb_autosave_v1';
    // Debounce save
    let timer: any = null;
    const save = () => {
      const payload = JSON.stringify({ nodes, edges, timestamp: Date.now() });
      localStorage.setItem(key, payload);
      // console.log('Autosaved layout');
    };

    if (nodes.length || edges.length) {
      clearTimeout(timer);
      timer = setTimeout(save, 600);
    }

    const onUnload = () => {
      save();
    };

    window.addEventListener('beforeunload', onUnload);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [nodes, edges]);

  // Restore autosave if present (only on mount)
  useEffect(() => {
    const key = 'psb_autosave_v1';
    const raw = localStorage.getItem(key);
    // If we already loaded an explicit imported strategy, do not restore autosave
    if (didLoadImportedRef.current) return;

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.nodes && parsed.edges) {
          setNodes(parsed.nodes);
          setEdges(parsed.edges);
          console.log('Restored autosaved layout from localStorage');
        }
      } catch (e) {
        // ignore
      }
    }
  }, [setNodes, setEdges]);
  
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
              // Preserve explicit positions when present; apply spacing for nodes lacking positions
              const flowNodes = importedStrategy.nodes.map((node: any) => ({ ...node }));
              const flowEdges = importedStrategy.edges.map((edge: any) => ({
                id: `${edge.from}-${edge.to}`,
                source: edge.from,
                target: edge.to,
                ...edgeOptions,
              }));

              const nodesWithPositions = flowNodes.map((n: any) => {
                if (n.position && typeof n.position.x === 'number' && typeof n.position.y === 'number') {
                  return n;
                }
                return null;
              });

              const nodesMissingPos = flowNodes.filter((n: any, i: number) => nodesWithPositions[i] === null);
              const spacedForMissing = nodesMissingPos.length > 0 ? addNodeSpacing(nodesMissingPos, flowEdges) : [];

              const mergedNodes = flowNodes.map((n: any) => {
                const found = spacedForMissing.find((fn: any) => fn.id === n.id);
                return found ? found : n;
              });

              setNodes(mergedNodes);
              setEdges(flowEdges);
              saveToHistory(mergedNodes, flowEdges);
              // Mark that we just loaded an explicit import so autosave won't override it
              didLoadImportedRef.current = true;
              // Clear autosave when user explicitly imports a file (explicit action wins)
              localStorage.removeItem('psb_autosave_v1');
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
      nodes: nodes.map(n => ({ id: n.id, type: n.type, position: n.position, data: n.data })),
  edges: edges.map(e => ({ id: e.id, source: e.source, target: e.target, from: e.source, to: e.target, animated: e.animated, style: e.style })),
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
    <div className="min-h-screen w-full bg-gray-900">
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-50 h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
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
          <button
            onClick={async () => {
              try {
                const t = toast({ title: 'Backtest started', description: 'Running simulated backtest...' });
                const res = await runBacktest(nodes, edges);
                toast({ title: 'Backtest complete', description: 'Results available in Strategy Analytics' });
                console.log('Backtest results:', res);
              } catch (err) {
                toast({ title: 'Backtest failed', description: String(err) });
              }
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
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
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
            <Settings size={18} />
          </button>
      </div>

      {/* Main Layout: Sticky Left Palette + Scrollable Main Content */}
      <div className="flex">
        {/* Sticky Left Palette */}
        <div className="sticky top-16 w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto" style={{ height: 'calc(100vh - 4rem)' }}>
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <div className="text-lg font-semibold text-white">Node Palette</div>
              <button
                aria-label="Toggle palette"
                onClick={() => setIsLeftCollapsed(v => !v)}
                className="p-2 rounded hover:bg-gray-700 text-gray-300"
              >
                {isLeftCollapsed ? '→' : '←'}
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <NodePalette />
            </div>
          </div>
        </div>

        {/* Main Scrollable Content */}
        <div className="flex-1 min-h-screen">
          {/* Canvas Section - Large minimum height */}
          <div className="bg-gray-900 relative" style={{ minHeight: '120vh' }}>
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
                zoomOnDoubleClick={true}
                selectionOnDrag
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
              onClick={() => setIsLeftCollapsed(v => !v)}
              className="absolute top-4 left-4 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-600 transition-colors z-10"
              aria-label="Toggle palette"
            >
              <Layers size={18} />
            </button>
          </div>

          {/* Strategy Analytics Section - Below Canvas */}
          <div className="bg-gray-800 border-t border-gray-700" style={{ minHeight: '80vh', padding: '3rem' }}>
            <div className="max-w-none">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
                  <BarChart3 size={24} />
                  <span>Strategy Analytics</span>
                </h2>
              </div>
              <StrategyMetrics isOpen={true} />
            </div>
          </div>
        </div>

          {/* Node Editor Overlay */}
          <AnimatePresence>
            {(isEditorOpen || isEdgeEditorOpen) && (
              <motion.div
                initial={{ x: 350, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 350, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-16 right-0 bg-gray-800 border-l border-gray-700 overflow-y-auto z-40"
                style={{ width: 320, height: 'calc(100vh - 4rem)' }}
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
      </div>
    </div>
  );
};

export default ProfessionalStrategyBuilder;
