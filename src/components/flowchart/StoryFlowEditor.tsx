
import { useState, useCallback, useMemo } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Panel,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { initialNodes, initialEdges } from './storyFlowData';
import StoryNode from './nodes/StoryNode';
import StoryNodeMenu from './StoryNodeMenu';
import { Button } from '@/components/ui/button';
import { Plus, Save, ZoomIn, ZoomOut } from 'lucide-react';

const nodeTypes = {
  storyNode: StoryNode,
};

const StoryFlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  
  // Handle node selection
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);
  
  // Handle edge creation
  const onConnect = useCallback((params) => {
    const newEdge = {
      ...params,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#555' },
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);
  
  // Handle background click to add a new node
  const onPaneClick = useCallback((event) => {
    // Clear selection
    setSelectedNode(null);
    setShowMenu(false);
  }, []);
  
  // Handle right-click to show context menu
  const onPaneContextMenu = useCallback((event) => {
    // Prevent default context menu
    event.preventDefault();
    
    // Get the position relative to the pane
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };
    
    setMenuPosition(position);
    setShowMenu(true);
  }, []);
  
  // Add a new node at the clicked position
  const addNewNode = useCallback((type = '起') => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: 'storyNode',
      position: menuPosition,
      data: { 
        label: '新しいシーン', 
        type: type,
        description: '',
        characters: [],
        notes: ''
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setShowMenu(false);
  }, [menuPosition, setNodes]);
  
  // Get the flow style
  const flowStyle = {
    background: '#f8f9fa',
    width: '100%',
    height: '100%',
  };
  
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        style={flowStyle}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background
          variant="dots"
          gap={12}
          size={1}
        />
        
        <Panel position="top-right" className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => addNewNode('起')}>
            <Plus className="h-4 w-4 mr-1" />
            新シーン
          </Button>
          <Button size="sm" variant="outline">
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
        </Panel>
        
        {showMenu && (
          <StoryNodeMenu 
            position={menuPosition}
            onSelect={addNewNode}
            onClose={() => setShowMenu(false)}
          />
        )}
      </ReactFlow>
      
      {selectedNode && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 h-[30%] overflow-auto">
          <h3 className="font-medium text-lg mb-2">{selectedNode.data.label}</h3>
          <p className="text-gray-500 text-sm mb-4">シーンの詳細情報やメモを編集できます</p>
          
          <div className="flex flex-col space-y-2">
            <input
              type="text"
              value={selectedNode.data.label}
              onChange={(e) => {
                const newLabel = e.target.value;
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === selectedNode.id
                      ? { ...node, data: { ...node.data, label: newLabel } }
                      : node
                  )
                );
              }}
              className="border rounded p-2"
              placeholder="シーンのタイトル"
            />
            
            <textarea
              value={selectedNode.data.description || ''}
              onChange={(e) => {
                const newDesc = e.target.value;
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === selectedNode.id
                      ? { ...node, data: { ...node.data, description: newDesc } }
                      : node
                  )
                );
              }}
              className="border rounded p-2 h-20"
              placeholder="シーンの説明"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryFlowEditor;
