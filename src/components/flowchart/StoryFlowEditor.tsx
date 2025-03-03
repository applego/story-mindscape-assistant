
import { useState, useCallback, useRef, useEffect } from 'react';
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
  Node,
  NodeMouseHandler,
  ReactFlowProvider,
  Viewport
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { initialNodes, initialEdges } from './storyFlowData';
import StoryNode, { StoryNodeData } from './nodes/StoryNode';
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

const StoryFlowEditorContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StoryNodeData> | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  
  const reactFlowInstance = useReactFlow();
  
  useEffect(() => {
    try {
      const savedFlow = localStorage.getItem('storyflow');
      if (savedFlow) {
        const flow = JSON.parse(savedFlow);
        if (flow.nodes && flow.nodes.length > 0) {
          setNodes(flow.nodes);
          setEdges(flow.edges || []);
          console.log('保存データを読み込みました');
        } else {
          console.log('保存データが空のため、初期データを使用します');
        }
      } else {
        console.log('保存データがないため、初期データを使用します');
      }
    } catch (error) {
      console.error('Flow loading error:', error);
    }
    
    const timer = setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
        console.log('ビューをリセットしました');
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [reactFlowInstance, setNodes, setEdges]);
  
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node as Node<StoryNodeData>);
  }, []);
  
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
  
  const onPaneClick = useCallback((event) => {
    if (showMenu) {
      setShowMenu(false);
      return;
    }
    setSelectedNode(null);
  }, [showMenu]);
  
  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    };
    
    setMenuPosition(position);
    setShowMenu(true);
  }, []);
  
  const addNewNode = useCallback((phase = 'ki') => {
    const newNode: Node<StoryNodeData> = {
      id: `node_${Date.now()}`,
      type: 'storyNode',
      position: menuPosition,
      data: { 
        label: '新しいシーン', 
        description: '',
        phase: phase as 'ki' | 'sho' | 'ten' | 'ketsu',
        characters: [],
        title: '新しいシーン',
        content: '',
        tags: [],
        notes: '',
      },
    };
    
    setNodes((nds) => [...nds, newNode]);
    setShowMenu(false);
    toast.success('新しいシーンを作成しました');
  }, [menuPosition, setNodes]);
  
  const handleNodeUpdate = useCallback((nodeId: string, newData: Partial<StoryNodeData>) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);
  
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
  
  const saveFlow = useCallback(() => {
    const flow = reactFlowInstance.toObject();
    localStorage.setItem('storyflow', JSON.stringify(flow));
    toast.success('ストーリーフローを保存しました');
  }, [reactFlowInstance]);
  
  const loadSavedFlow = useCallback(() => {
    try {
      const savedFlow = localStorage.getItem('storyflow');
      if (savedFlow) {
        const flow = JSON.parse(savedFlow);
        if (flow.nodes && flow.nodes.length > 0) {
          setNodes(flow.nodes || []);
          setEdges(flow.edges || []);
          toast.success('ストーリーフローを読み込みました');
          
          setTimeout(() => {
            reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
          }, 100);
        } else {
          setNodes(initialNodes);
          setEdges(initialEdges);
          toast.success('初期データを読み込みました');
          
          setTimeout(() => {
            reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
          }, 100);
        }
      } else {
        setNodes(initialNodes);
        setEdges(initialEdges);
        toast.success('初期データを読み込みました');
        
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
        }, 100);
      }
    } catch (error) {
      console.error('Flow loading error:', error);
      setNodes(initialNodes);
      setEdges(initialEdges);
      toast.error('読み込みエラーが発生しました。初期データを表示します。');
      
      setTimeout(() => {
        reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
      }, 100);
    }
  }, [setNodes, setEdges, reactFlowInstance]);
  
  const resetView = useCallback(() => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
      toast.success('ビューをリセットしました');
    }
  }, [reactFlowInstance]);
  
  const resetToInitialData = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
    }, 100);
    
    toast.success('初期データに戻しました');
  }, [setNodes, setEdges, reactFlowInstance]);
  
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
        style={{ width: '100%', height: '100%' }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Controls position="bottom-right" />
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
        
        <Panel position="top-right" className="flex flex-col gap-2 z-10">
          <div className="flex gap-2 p-3 bg-white rounded-lg shadow-md mb-2">
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
          </div>
          
          <div className="flex gap-2 p-3 bg-white rounded-lg shadow-md">
            <Button 
              size="sm" 
              variant="default" 
              onClick={resetView}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <ZoomOut className="h-4 w-4 mr-1" />
              全体表示
            </Button>
            <Button 
              size="sm" 
              variant="default" 
              onClick={resetToInitialData}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Repeat className="h-4 w-4 mr-1" />
              初期化
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowAIAssistant(true)}
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              AIアシスト
            </Button>
          </div>
          
          {selectedNode && (
            <div className="p-3 bg-white rounded-lg shadow-md">
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={deleteSelectedNode}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                削除
              </Button>
            </div>
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

const StoryFlowEditor = () => {
  return (
    <ReactFlowProvider>
      <StoryFlowEditorContent />
    </ReactFlowProvider>
  );
};

export default StoryFlowEditor;
