import React from 'react';
import { Node } from 'reactflow';
import { Settings, X, Save, RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useStrategyStore } from '../../stores/strategyStore';

interface NodeEditorProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  onNodesChange: (nodes: Node[]) => void;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ isOpen, onClose, nodes, onNodesChange }) => {
  const { selectedNodeId, setSelectedNodeId } = useStrategyStore();
  
  const selectedNode = nodes.find(node => node.id === selectedNodeId);
  
  const updateNodeData = (updates: Record<string, any>) => {
    if (!selectedNode) return;
    
    const updatedNodes = nodes.map(node => 
      node.id === selectedNode.id 
        ? { ...node, data: { ...node.data, ...updates } }
        : node
    );
    onNodesChange(updatedNodes);
  };
  
  const resetNodeData = () => {
    if (!selectedNode) return;
    
    // Reset to default values based on node type
    const defaultData = getDefaultNodeData(selectedNode.type);
    const updatedNodes = nodes.map(node => 
      node.id === selectedNode.id 
        ? { ...node, data: defaultData }
        : node
    );
    onNodesChange(updatedNodes);
  };
  
  const getDefaultNodeData = (nodeType: string) => {
    switch (nodeType) {
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
  
  const renderNodeEditor = () => {
    if (!selectedNode) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <div className="text-center">
            <Settings size={48} className="mx-auto mb-4 opacity-50" />
            <p>Select a node to edit its properties</p>
          </div>
        </div>
      );
    }
    
    const { data, type } = selectedNode;
    
    switch (type) {
      case 'stock':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="symbol">Stock Symbol</Label>
              <Input
                id="symbol"
                value={data?.symbol || ''}
                onChange={(e) => updateNodeData({ symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL"
              />
            </div>
            <div>
              <Label htmlFor="price">Current Price</Label>
              <Input
                id="price"
                type="number"
                value={data?.price || ''}
                onChange={(e) => updateNodeData({ price: parseFloat(e.target.value) })}
                placeholder="150.00"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={data?.quantity || ''}
                onChange={(e) => updateNodeData({ quantity: parseInt(e.target.value) })}
                placeholder="100"
              />
            </div>
          </div>
        );
        
      case 'optionLeg':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="symbol">Underlying Symbol</Label>
              <Input
                id="symbol"
                value={data?.symbol || ''}
                onChange={(e) => updateNodeData({ symbol: e.target.value.toUpperCase() })}
                placeholder="AAPL"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="strike">Strike Price</Label>
                <Input
                  id="strike"
                  type="number"
                  value={data?.strike || ''}
                  onChange={(e) => updateNodeData({ strike: parseFloat(e.target.value) })}
                  placeholder="150"
                />
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={data?.quantity || ''}
                  onChange={(e) => updateNodeData({ quantity: parseInt(e.target.value) })}
                  placeholder="1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expiry">Expiration Date</Label>
              <Input
                id="expiry"
                type="date"
                value={data?.expiry || ''}
                onChange={(e) => updateNodeData({ expiry: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Option Type</Label>
                <Select value={data?.type || 'call'} onValueChange={(value) => updateNodeData({ type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="put">Put</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Action</Label>
                <Select value={data?.action || 'buy'} onValueChange={(value) => updateNodeData({ action: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
        
      case 'priceCondition':
        return (
          <div className="space-y-4">
            <div>
              <Label>Condition</Label>
              <Select value={data?.operator || 'greater_than'} onValueChange={(value) => updateNodeData({ operator: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater_than">Price &gt;</SelectItem>
                  <SelectItem value="less_than">Price &lt;</SelectItem>
                  <SelectItem value="equal_to">Price =</SelectItem>
                  <SelectItem value="crosses_above">Crosses Above</SelectItem>
                  <SelectItem value="crosses_below">Crosses Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Target Price</Label>
              <Input
                id="value"
                type="number"
                value={data?.value || ''}
                onChange={(e) => updateNodeData({ value: parseFloat(e.target.value) })}
                placeholder="150.00"
              />
            </div>
            <div>
              <Label>Timeframe</Label>
              <Select value={data?.timeframe || '1d'} onValueChange={(value) => updateNodeData({ timeframe: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 Minute</SelectItem>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'technicalIndicator':
        return (
          <div className="space-y-4">
            <div>
              <Label>Indicator</Label>
              <Select value={data?.indicator || 'sma'} onValueChange={(value) => updateNodeData({ indicator: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sma">Simple Moving Average</SelectItem>
                  <SelectItem value="ema">Exponential Moving Average</SelectItem>
                  <SelectItem value="rsi">RSI</SelectItem>
                  <SelectItem value="macd">MACD</SelectItem>
                  <SelectItem value="bollinger">Bollinger Bands</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                type="number"
                value={data?.period || ''}
                onChange={(e) => updateNodeData({ period: parseInt(e.target.value) })}
                placeholder="20"
              />
            </div>
            <div>
              <Label htmlFor="value">Target Value</Label>
              <Input
                id="value"
                type="number"
                value={data?.value || ''}
                onChange={(e) => updateNodeData({ value: parseFloat(e.target.value) })}
                placeholder="150.00"
              />
            </div>
          </div>
        );
        
      case 'profitTarget':
        return (
          <div className="space-y-4">
            <div>
              <Label>Target Type</Label>
              <Select value={data?.type || 'percentage'} onValueChange={(value) => updateNodeData({ type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                  <SelectItem value="price">Price Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Target Value</Label>
              <Input
                id="value"
                type="number"
                value={data?.value || ''}
                onChange={(e) => updateNodeData({ value: parseFloat(e.target.value) })}
                placeholder={data?.type === 'percentage' ? '20' : '150.00'}
              />
              {data?.type === 'percentage' && <p className="text-xs text-gray-400 mt-1">Enter as percentage (e.g., 20 for 20%)</p>}
            </div>
          </div>
        );
        
      case 'stopLoss':
        return (
          <div className="space-y-4">
            <div>
              <Label>Stop Type</Label>
              <Select value={data?.type || 'percentage'} onValueChange={(value) => updateNodeData({ type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="points">Points</SelectItem>
                  <SelectItem value="price">Price Level</SelectItem>
                  <SelectItem value="trailing">Trailing Stop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Stop Value</Label>
              <Input
                id="value"
                type="number"
                value={data?.value || ''}
                onChange={(e) => updateNodeData({ value: parseFloat(e.target.value) })}
                placeholder={data?.type === 'percentage' ? '10' : '140.00'}
              />
              {data?.type === 'percentage' && <p className="text-xs text-gray-400 mt-1">Enter as percentage (e.g., 10 for 10%)</p>}
            </div>
          </div>
        );
        
      case 'positionSizing':
        return (
          <div className="space-y-4">
            <div>
              <Label>Sizing Method</Label>
              <Select value={data?.method || 'fixed'} onValueChange={(value) => updateNodeData({ method: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                  <SelectItem value="fixed_percent">Fixed Percentage</SelectItem>
                  <SelectItem value="kelly">Kelly Criterion</SelectItem>
                  <SelectItem value="risk_parity">Risk Parity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">
                {data?.method === 'fixed_percent' ? 'Percentage of Portfolio' : 'Fixed Amount'}
              </Label>
              <Input
                id="value"
                type="number"
                value={data?.value || ''}
                onChange={(e) => updateNodeData({ value: parseFloat(e.target.value) })}
                placeholder={data?.method === 'fixed_percent' ? '10' : '1000'}
              />
              {data?.method === 'fixed_percent' && <p className="text-xs text-gray-400 mt-1">Enter as percentage (e.g., 10 for 10%)</p>}
            </div>
            {data?.method !== 'fixed' && (
              <div>
                <Label htmlFor="maxRisk">Maximum Risk (%)</Label>
                <Input
                  id="maxRisk"
                  type="number"
                  value={data?.maxRisk || ''}
                  onChange={(e) => updateNodeData({ maxRisk: parseFloat(e.target.value) })}
                  placeholder="5"
                />
              </div>
            )}
          </div>
        );
        
      case 'orderType':
        return (
          <div className="space-y-4">
            <div>
              <Label>Order Type</Label>
              <Select value={data?.type || 'market'} onValueChange={(value) => updateNodeData({ type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                  <SelectItem value="stop_limit">Stop Limit Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(data?.type === 'limit' || data?.type === 'stop_limit') && (
              <div>
                <Label htmlFor="price">Limit Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={data?.price || ''}
                  onChange={(e) => updateNodeData({ price: parseFloat(e.target.value) })}
                  placeholder="150.00"
                />
              </div>
            )}
            {(data?.type === 'stop' || data?.type === 'stop_limit') && (
              <div>
                <Label htmlFor="stopPrice">Stop Price</Label>
                <Input
                  id="stopPrice"
                  type="number"
                  value={data?.stopPrice || ''}
                  onChange={(e) => updateNodeData({ stopPrice: parseFloat(e.target.value) })}
                  placeholder="145.00"
                />
              </div>
            )}
            <div>
              <Label>Time in Force</Label>
              <Select value={data?.timeInForce || 'DAY'} onValueChange={(value) => updateNodeData({ timeInForce: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAY">Day</SelectItem>
                  <SelectItem value="GTC">Good Till Canceled</SelectItem>
                  <SelectItem value="IOC">Immediate or Cancel</SelectItem>
                  <SelectItem value="FOK">Fill or Kill</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'payoffChart':
        return (
          <div className="space-y-4">
            <div>
              <Label>Chart Type</Label>
              <Select value={data?.chartType || 'P&L vs Price'} onValueChange={(value) => updateNodeData({ chartType: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P&L vs Price">P&L vs Price</SelectItem>
                  <SelectItem value="P&L vs Time">P&L vs Time</SelectItem>
                  <SelectItem value="Greeks">Greeks Analysis</SelectItem>
                  <SelectItem value="Probability">Probability Cone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="maxProfit">Max Profit</Label>
              <Input
                id="maxProfit"
                type="number"
                value={data?.maxProfit || ''}
                onChange={(e) => updateNodeData({ maxProfit: parseFloat(e.target.value) })}
                placeholder="Leave empty for unlimited"
              />
            </div>
            <div>
              <Label htmlFor="maxLoss">Max Loss</Label>
              <Input
                id="maxLoss"
                type="number"
                value={data?.maxLoss || ''}
                onChange={(e) => updateNodeData({ maxLoss: parseFloat(e.target.value) })}
                placeholder="Leave empty for unlimited"
              />
            </div>
            <div>
              <Label htmlFor="breakeven">Breakeven Point</Label>
              <Input
                id="breakeven"
                type="number"
                value={data?.breakeven || ''}
                onChange={(e) => updateNodeData({ breakeven: parseFloat(e.target.value) })}
                placeholder="150.00"
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="text-center text-gray-400">
            <p>No editor available for this node type</p>
          </div>
        );
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Card className="w-80 h-full bg-gray-900 border-gray-700 flex flex-col strategy-scrollbar">
      <CardHeader className="flex-shrink-0 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center space-x-2">
            <Settings size={20} />
            <span>Node Editor</span>
            {selectedNodeId && (
              <span className="text-xs bg-blue-600 px-2 py-1 rounded">
                {selectedNodeId}
              </span>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </div>
        {selectedNode && (
          <div className="text-sm text-gray-400">
            Editing: <span className="text-white font-medium">{selectedNode.type}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto strategy-scrollbar">
        {renderNodeEditor()}
      </CardContent>
      
      {selectedNode && (
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetNodeData}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <RotateCcw size={14} className="mr-1" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Save size={14} className="mr-1" />
              Done
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default NodeEditor;
