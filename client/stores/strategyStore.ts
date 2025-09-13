import { create } from 'zustand';
import { Node, Edge } from 'reactflow';
import api from '../lib/api';

export interface StrategyData {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  metadata: {
    created: string;
    lastModified: string;
    version: number;
    backtest_results?: any;
    risk_metrics?: any;
  };
}

// Database strategy interface (matches server model)
export interface DbStrategy {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  version: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  privacy: "private" | "public" | "marketplace";
}

export interface ValidationError {
  nodeId?: string;
  edgeId?: string;
  type: 'error' | 'warning';
  message: string;
}

interface StrategyStore {
  // Current strategy data
  strategyData: StrategyData;
  
  // UI state
  selectedNodeId: string | null;
  
  // Validation
  validationErrors: ValidationError[];
  isValid: boolean;
  
  // History for undo/redo
  history: StrategyData[];
  historyIndex: number;
  
  // Database state
  currentDbStrategyId: string | null;
  isLoading: boolean;
  
  // Actions
  updateStrategy: (nodes: Node[], edges: Edge[]) => void;
  setStrategyName: (name: string) => void;
  setStrategyDescription: (description: string) => void;
  validateStrategy: (nodes: Node[], edges: Edge[]) => ValidationError[];
  exportStrategy: (nodes: Node[], edges: Edge[]) => StrategyData;
  importStrategy: (strategy: StrategyData) => void;
  undo: () => StrategyData | null;
  redo: () => StrategyData | null;
  resetStrategy: () => void;
  
  // Database actions
  saveStrategyToDB: (tags?: string[], privacy?: "private" | "public" | "marketplace") => Promise<DbStrategy | null>;
  loadStrategyFromDB: (id: string) => Promise<boolean>;
  updateStrategyInDB: (tags?: string[], privacy?: "private" | "public" | "marketplace") => Promise<DbStrategy | null>;
  deleteStrategyFromDB: (id: string) => Promise<boolean>;
  createNewStrategy: () => void;
  
  // UI actions
  setSelectedNodeId: (nodeId: string | null) => void;
  
  // History actions
  saveToHistory: (nodes: Node[], edges: Edge[]) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

const createEmptyStrategy = (): StrategyData => ({
  id: `strategy-${Date.now()}`,
  name: 'Untitled Strategy',
  description: '',
  nodes: [],
  edges: [],
  metadata: {
    created: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    version: 1,
  },
});

export const useStrategyStore = create<StrategyStore>((set, get) => ({
  strategyData: createEmptyStrategy(),
  selectedNodeId: null,
  validationErrors: [],
  isValid: true,
  history: [],
  historyIndex: -1,
  currentDbStrategyId: null,
  isLoading: false,
  
  updateStrategy: (nodes: Node[], edges: Edge[]) => {
    const currentStrategy = get().strategyData;
    const errors = get().validateStrategy(nodes, edges);
    
    const updatedStrategy: StrategyData = {
      ...currentStrategy,
      nodes,
      edges,
      metadata: {
        ...currentStrategy.metadata,
        lastModified: new Date().toISOString(),
      },
    };
    
    // Add to history for undo/redo
    const history = get().history.slice(0, get().historyIndex + 1);
    history.push(updatedStrategy);
    
    set({
      strategyData: updatedStrategy,
      validationErrors: errors,
      isValid: errors.filter(e => e.type === 'error').length === 0,
      history,
      historyIndex: history.length - 1,
    });
  },
  
  setStrategyName: (name: string) => {
    const currentStrategy = get().strategyData;
    set({
      strategyData: {
        ...currentStrategy,
        name,
        metadata: {
          ...currentStrategy.metadata,
          lastModified: new Date().toISOString(),
        },
      },
    });
  },
  
  setStrategyDescription: (description: string) => {
    const currentStrategy = get().strategyData;
    set({
      strategyData: {
        ...currentStrategy,
        description,
        metadata: {
          ...currentStrategy.metadata,
          lastModified: new Date().toISOString(),
        },
      },
    });
  },
  
  validateStrategy: (nodes: Node[], edges: Edge[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    // Check for required components
    const hasEntry = nodes.some(n => ['priceCondition', 'technicalIndicator'].includes(n.type || ''));
    const hasExit = nodes.some(n => ['profitTarget', 'stopLoss'].includes(n.type || ''));
    const hasInstrument = nodes.some(n => ['stock', 'optionLeg'].includes(n.type || ''));
    
    if (!hasEntry) {
      errors.push({
        type: 'error',
        message: 'Strategy must have at least one entry condition (Price Condition or Technical Indicator)',
      });
    }
    
    if (!hasExit) {
      errors.push({
        type: 'error',
        message: 'Strategy must have at least one exit condition (Profit Target or Stop Loss)',
      });
    }
    
    if (!hasInstrument) {
      errors.push({
        type: 'error',
        message: 'Strategy must have at least one trading instrument (Stock or Option Leg)',
      });
    }
    
    // Check for circular dependencies
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCircularDependency = (nodeId: string): boolean => {
      if (recursionStack.has(nodeId)) return true;
      if (visited.has(nodeId)) return false;
      
      visited.add(nodeId);
      recursionStack.add(nodeId);
      
      const outgoingEdges = edges.filter(e => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (hasCircularDependency(edge.target)) return true;
      }
      
      recursionStack.delete(nodeId);
      return false;
    };
    
    for (const node of nodes) {
      if (hasCircularDependency(node.id)) {
        errors.push({
          nodeId: node.id,
          type: 'error',
          message: 'Circular dependency detected',
        });
        break;
      }
    }
    
    // Validate individual nodes
    nodes.forEach(node => {
      if (node.type === 'stock' && !node.data?.symbol) {
        errors.push({
          nodeId: node.id,
          type: 'error',
          message: 'Stock node requires a symbol',
        });
      }
      
      if (node.type === 'optionLeg') {
        if (!node.data?.underlying) {
          errors.push({
            nodeId: node.id,
            type: 'error',
            message: 'Option leg requires an underlying symbol',
          });
        }
        if (!node.data?.strike || node.data.strike <= 0) {
          errors.push({
            nodeId: node.id,
            type: 'error',
            message: 'Option leg requires a valid strike price',
          });
        }
        if (!node.data?.expiry) {
          errors.push({
            nodeId: node.id,
            type: 'error',
            message: 'Option leg requires an expiry date',
          });
        }
      }
    });
    
    return errors;
  },
  
  exportStrategy: (nodes: Node[], edges: Edge[]): StrategyData => {
    const currentStrategy = get().strategyData;
    return {
      ...currentStrategy,
      nodes,
      edges,
      metadata: {
        ...currentStrategy.metadata,
        lastModified: new Date().toISOString(),
      },
    };
  },
  
  importStrategy: (strategy: StrategyData) => {
    set({
      strategyData: strategy,
      validationErrors: get().validateStrategy(strategy.nodes, strategy.edges),
      isValid: true,
    });
  },
  
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const previousStrategy = history[historyIndex - 1];
      set({
        strategyData: previousStrategy,
        historyIndex: historyIndex - 1,
        validationErrors: get().validateStrategy(previousStrategy.nodes, previousStrategy.edges),
      });
      return previousStrategy;
    }
    return null;
  },
  
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextStrategy = history[historyIndex + 1];
      set({
        strategyData: nextStrategy,
        historyIndex: historyIndex + 1,
        validationErrors: get().validateStrategy(nextStrategy.nodes, nextStrategy.edges),
      });
      return nextStrategy;
    }
    return null;
  },
  
  resetStrategy: () => {
    set({
      strategyData: createEmptyStrategy(),
      validationErrors: [],
      isValid: true,
      history: [],
      historyIndex: -1,
      selectedNodeId: null,
    });
  },
  
  setSelectedNodeId: (nodeId: string | null) => {
    set({ selectedNodeId: nodeId });
  },
  
  saveToHistory: (nodes: Node[], edges: Edge[]) => {
    const currentStrategy = get().strategyData;
    const updatedStrategy: StrategyData = {
      ...currentStrategy,
      nodes,
      edges,
      metadata: {
        ...currentStrategy.metadata,
        lastModified: new Date().toISOString(),
      },
    };
    
    const history = get().history.slice(0, get().historyIndex + 1);
    history.push(updatedStrategy);
    
    set({
      strategyData: updatedStrategy,
      history,
      historyIndex: history.length - 1,
    });
  },
  
  canUndo: () => {
    return get().historyIndex > 0;
  },
  
  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  // Database methods
  saveStrategyToDB: async (tags: string[] = [], privacy: "private" | "public" | "marketplace" = "private") => {
    try {
      set({ isLoading: true });
      const { strategyData } = get();
      
      const payload = {
        title: strategyData.name || 'Untitled Strategy',
        description: strategyData.description || '',
        nodes: strategyData.nodes,
        edges: strategyData.edges,
        tags,
        privacy,
      };
      
      const response = await api.post('/strategies', payload);
      const dbStrategy: DbStrategy = response.data;
      
      set({ 
        currentDbStrategyId: dbStrategy._id,
        isLoading: false 
      });
      
      return dbStrategy;
    } catch (error) {
      console.error('Failed to save strategy to database:', error);
      set({ isLoading: false });
      return null;
    }
  },

  loadStrategyFromDB: async (id: string) => {
    try {
      set({ isLoading: true });
      
      const response = await api.get(`/strategies/${id}`);
      const dbStrategy: DbStrategy = response.data;
      
      // Convert DB strategy to local strategy format
      const localStrategy: StrategyData = {
        id: dbStrategy._id,
        name: dbStrategy.title,
        description: dbStrategy.description,
        nodes: dbStrategy.nodes || [],
        edges: dbStrategy.edges || [],
        metadata: {
          created: dbStrategy.createdAt,
          lastModified: dbStrategy.updatedAt,
          version: dbStrategy.version,
        },
      };
      
      set({
        strategyData: localStrategy,
        currentDbStrategyId: dbStrategy._id,
        isLoading: false,
        validationErrors: [],
        history: [localStrategy],
        historyIndex: 0,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to load strategy from database:', error);
      set({ isLoading: false });
      return false;
    }
  },

  updateStrategyInDB: async (tags: string[] = [], privacy: "private" | "public" | "marketplace" = "private") => {
    try {
      const { currentDbStrategyId, strategyData } = get();
      if (!currentDbStrategyId) {
        // If no current DB ID, save as new strategy
        return get().saveStrategyToDB(tags, privacy);
      }
      
      set({ isLoading: true });
      
      const payload = {
        title: strategyData.name || 'Untitled Strategy',
        description: strategyData.description || '',
        nodes: strategyData.nodes,
        edges: strategyData.edges,
        tags,
        privacy,
      };
      
      const response = await api.put(`/strategies/${currentDbStrategyId}`, payload);
      const dbStrategy: DbStrategy = response.data;
      
      set({ isLoading: false });
      return dbStrategy;
    } catch (error) {
      console.error('Failed to update strategy in database:', error);
      set({ isLoading: false });
      return null;
    }
  },

  deleteStrategyFromDB: async (id: string) => {
    try {
      set({ isLoading: true });
      await api.delete(`/strategies/${id}`);
      
      // If we're deleting the current strategy, reset to new strategy
      if (get().currentDbStrategyId === id) {
        get().createNewStrategy();
      }
      
      set({ isLoading: false });
      return true;
    } catch (error) {
      console.error('Failed to delete strategy from database:', error);
      set({ isLoading: false });
      return false;
    }
  },

  createNewStrategy: () => {
    set({
      strategyData: createEmptyStrategy(),
      validationErrors: [],
      isValid: true,
      history: [],
      historyIndex: -1,
      selectedNodeId: null,
      currentDbStrategyId: null,
    });
  },
}));
