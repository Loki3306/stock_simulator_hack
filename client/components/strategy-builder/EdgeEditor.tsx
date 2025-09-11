import React from 'react';
import { Edge, Node } from 'reactflow';
import { Trash2, ArrowRight, Link } from 'lucide-react';

interface EdgeEditorProps {
  edge: Edge | null;
  nodes: Node[];
  onUpdateEdge: (edgeId: string, newSource?: string, newTarget?: string) => void;
  onDeleteEdge: () => void;
  onClose: () => void;
}

export default function EdgeEditor({ edge, nodes, onUpdateEdge, onDeleteEdge, onClose }: EdgeEditorProps) {
  if (!edge) return null;

  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  const handleSourceChange = (newSourceId: string) => {
    if (newSourceId !== edge.source) {
      onUpdateEdge(edge.id, newSourceId, undefined);
    }
  };

  const handleTargetChange = (newTargetId: string) => {
    if (newTargetId !== edge.target) {
      onUpdateEdge(edge.id, undefined, newTargetId);
    }
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 h-full flex flex-col strategy-scrollbar">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Edit Connection</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ×
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Connection Info */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-gray-300">
            <Link size={16} />
            <span className="text-sm font-medium">Connection Details</span>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>ID: {edge.id}</span>
            </div>
          </div>
        </div>

        {/* Source Node */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Source Node
          </label>
          <select
            value={edge.source}
            onChange={(e) => handleSourceChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.data?.label || node.data?.blockType || node.type} ({node.id.slice(-6)})
              </option>
            ))}
          </select>
          {sourceNode && (
            <div className="text-xs text-gray-500">
              Type: {sourceNode.type} | Position: ({sourceNode.position.x}, {sourceNode.position.y})
            </div>
          )}
        </div>

        {/* Arrow Indicator */}
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 text-purple-400">
            <ArrowRight size={20} />
            <span className="text-sm">Flow Direction</span>
          </div>
        </div>

        {/* Target Node */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Target Node
          </label>
          <select
            value={edge.target}
            onChange={(e) => handleTargetChange(e.target.value)}
            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {nodes.map(node => (
              <option key={node.id} value={node.id}>
                {node.data?.label || node.data?.blockType || node.type} ({node.id.slice(-6)})
              </option>
            ))}
          </select>
          {targetNode && (
            <div className="text-xs text-gray-500">
              Type: {targetNode.type} | Position: ({targetNode.position.x}, {targetNode.position.y})
            </div>
          )}
        </div>

        {/* Edge Properties */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            Connection Properties
          </label>
          <div className="bg-gray-900 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Animated:</span>
              <span className="text-white">{edge.animated ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{edge.type || 'default'}</span>
            </div>
            {edge.style && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Style:</span>
                <span className="text-white text-xs">Custom</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onDeleteEdge}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
          <span>Delete Connection</span>
        </button>
      </div>
    </div>
  );
}
