
import { useState, useCallback, useRef } from 'react';
import { 
  ReactFlow, 
  MiniMap, 
  Controls, 
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  BackgroundVariant,
  useReactFlow,
  Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { initialNodes, initialEdges } from './storyFlowData';
import StoryNode from './nodes/StoryNode';
import FlowAIAssistant from './FlowAIAssistant';
import NodeDetailPanel from './NodeDetailPanel';
import { nodeTypeColors } from './storyFlowStyles';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Trash2, 
  MessageCircle, 
  MoreHorizontal, 
  Repeat 
} from 'lucide-react';
import { toast } from 'sonner';

const nodeTypes = {
  storyNode: StoryNode,
};

const StoryFlowEditor = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const reactFlowInstance = useReactFlow();
  
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
    toast.success('シーン間の接続を作成しました');
  }, [setEdges]);
  
  // Handle background click
  const onPaneClick = useCallback((event) => {
    // 右クリックメニューが表示されている場合は非表示にする
    if (showMenu) {
      setShowMenu(false);
      return;
    }
    // 通常のクリックでは選択解除する
    setSelectedNode(null);
  }, [showMenu]);
  
  // Handle right-click for context menu
  const onPaneContextMenu = useCallback((event) => {
    // デフォルトのコンテキストメニューを表示しない
    event.preventDefault();
    
    // パネルに対する相対位置を取得
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };
    
    setMenuPosition(position);
    setShowMenu(true);
  }, []);
  
  // Add a new node at the clicked position
  const addNewNode = useCallback((phase = 'ki') => {
    const newNode = {
      id: `node_${Date.now()}`,
      type: 'storyNode',
      position: menuPosition,
      data: { 
        label: '新しいシーン', 
        type: phase === 'ki' ? '起' : phase === 'sho' ? '承' : phase === 'ten' ? '転' : '結',
        description: '',
        characters: [],
        notes: '',
        phase: phase
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setShowMenu(false);
    toast.success('新しいシーンを作成しました');
  }, [menuPosition, setNodes]);
  
  // Update node data
  const handleNodeUpdate = useCallback((nodeId, newData) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);
  
  // Delete selected node
  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) => 
      eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
    toast.success('シーンを削除しました');
  }, [selectedNode, setNodes, setEdges]);
  
  // Save the current flow
  const saveFlow = useCallback(() => {
    const flow = reactFlowInstance.toObject();
    localStorage.setItem('storyflow', JSON.stringify(flow));
    toast.success('ストーリーフローを保存しました');
  }, [reactFlowInstance]);
  
  // Load the saved flow
  const loadSavedFlow = useCallback(() => {
    const savedFlow = localStorage.getItem('storyflow');
    if (savedFlow) {
      const flow = JSON.parse(savedFlow);
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      toast.success('ストーリーフローを読み込みました');
    }
  }, [setNodes, setEdges]);
  
  return (
    <div className="w-full h-full flex flex-col">
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
        className="flex-1 bg-gray-50"
      >
        <Controls />
        <MiniMap 
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
        />
        
        <Panel position="top-right" className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => addNewNode('ki')}>
            <Plus className="h-4 w-4 mr-1" />
            新シーン
          </Button>
          <Button size="sm" variant="outline" onClick={saveFlow}>
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
          <Button size="sm" variant="outline" onClick={loadSavedFlow}>
            <Repeat className="h-4 w-4 mr-1" />
            読込
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => setShowAIAssistant(true)}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            AIアシスト
          </Button>
          {selectedNode && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={deleteSelectedNode}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              削除
            </Button>
          )}
        </Panel>
        
        {showMenu && (
          <div
            style={{
              position: 'absolute',
              left: menuPosition.x,
              top: menuPosition.y,
              zIndex: 10,
              backgroundColor: 'white',
              padding: '10px',
              borderRadius: '5px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }}
          >
            <div className="flex flex-col gap-2">
              <Button size="sm" onClick={() => addNewNode('ki')} className="justify-start">
                <div className="w-3 h-3 bg-blue-100 border border-blue-500 mr-2"></div>
                {nodeTypeColors.ki.label}
              </Button>
              <Button size="sm" onClick={() => addNewNode('sho')} className="justify-start">
                <div className="w-3 h-3 bg-green-100 border border-green-500 mr-2"></div>
                {nodeTypeColors.sho.label}
              </Button>
              <Button size="sm" onClick={() => addNewNode('ten')} className="justify-start">
                <div className="w-3 h-3 bg-orange-100 border border-orange-500 mr-2"></div>
                {nodeTypeColors.ten.label}
              </Button>
              <Button size="sm" onClick={() => addNewNode('ketsu')} className="justify-start">
                <div className="w-3 h-3 bg-purple-100 border border-purple-500 mr-2"></div>
                {nodeTypeColors.ketsu.label}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowMenu(false)}>閉じる</Button>
            </div>
          </div>
        )}
      </ReactFlow>
      
      <NodeDetailPanel
        selectedNode={selectedNode}
        onNodeUpdate={handleNodeUpdate}
      />

      <FlowAIAssistant
        isOpen={showAIAssistant}
        onOpenChange={setShowAIAssistant}
        selectedNodeId={selectedNode?.id || null}
      />
    </div>
  );
};

export default StoryFlowEditor;
