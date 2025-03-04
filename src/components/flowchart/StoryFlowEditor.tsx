
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
  Edge,
  Connection,
  NodeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { initialStoryNodes, initialStoryEdges } from './storyTreeData';
import StoryNode from './nodes/StoryNode';
import FlowAIAssistant from './FlowAIAssistant';
import NodeDetailPanel from './NodeDetailPanel';
import TimelineView from './TimelineView';
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
  Repeat,
  BookText,
  Route,
  Layout,
  Film,
  UserCircle,
  Clock,
  ArrowDownUp
} from 'lucide-react';
import { toast } from 'sonner';
import { StoryNodeData, FlowStoryNode } from './storyStructureTypes';

const nodeTypes = {
  storyNode: StoryNode,
};

const StoryFlowEditorContent = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<StoryNodeData>>(initialStoryNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialStoryEdges);
  const [selectedNode, setSelectedNode] = useState<Node<StoryNodeData> | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showTimeline, setShowTimeline] = useState(true);
  
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
          setNodes(initialStoryNodes);
          setEdges(initialStoryEdges);
        }
      } else {
        console.log('保存データがないため、初期データを使用します');
        setNodes(initialStoryNodes);
        setEdges(initialStoryEdges);
      }
    } catch (error) {
      console.error('Flow loading error:', error);
      setNodes(initialStoryNodes);
      setEdges(initialStoryEdges);
    }
    
    const timer = setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
        console.log('ビューをリセットしました');
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [reactFlowInstance, setNodes, setEdges]);
  
  // ノードのドラッグ時の処理を拡張
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // 標準の変更を適用
    onNodesChange(changes);
    
    // 位置の変更を見つける
    const positionChanges = changes.filter(
      change => change.type === 'position' && change.dragging
    );
    
    if (positionChanges.length > 0) {
      positionChanges.forEach(change => {
        if (change.type === 'position' && change.dragging) {
          const parentId = change.id;
          const dx = change.position?.x || 0;
          const dy = change.position?.y || 0;
          
          // 親ノードの子ノードを探して一緒に動かす
          setNodes(nds => {
            return nds.map(node => {
              // 子ノードの場合、親ノードと一緒に移動
              if (node.data.parentId === parentId) {
                // 元の位置からの差分を計算
                node.position = {
                  x: node.position.x + dx,
                  y: node.position.y + dy
                };
              }
              return node;
            });
          });
        }
      });
    }
  }, [onNodesChange, setNodes]);
  
  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node as Node<StoryNodeData>);
  }, []);
  
  const handleTimelineNodeClick = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      reactFlowInstance.setCenter(node.position.x, node.position.y, { zoom: 1.5, duration: 800 });
    }
  }, [nodes, reactFlowInstance]);
  
  const onConnect = useCallback((params: Connection) => {
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
    toast.success('ノード間の接続を作成しました');
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
  
  const addNewNode = useCallback((type: 'story' | 'storyline' | 'sequence' | 'scene' | 'action', parentId?: string) => {
    const newNode: Node<StoryNodeData> = {
      id: `${type}_${Date.now()}`,
      type: 'storyNode',
      position: menuPosition,
      data: { 
        id: `${type}_${Date.now()}`,
        type: type,
        title: `新しい${getNodeTypeLabel(type)}`,
        description: '',
        phase: 'ki',
        timePosition: 0,
        ...(parentId ? { parentId } : {}),
      } as StoryNodeData,
    };
    
    setNodes((nds) => [...nds, newNode]);
    
    if (parentId) {
      const newEdge = {
        id: `edge-${parentId}-${newNode.id}`,
        source: parentId,
        target: newNode.id,
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { strokeWidth: 2 },
      };
      setEdges((eds) => [...eds, newEdge]);
    }
    
    setShowMenu(false);
    toast.success(`新しい${getNodeTypeLabel(type)}を作成しました`);
  }, [menuPosition, setNodes, setEdges]);
  
  const getNodeTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'story': return 'ストーリーライン構成';
      case 'storyline': return 'ストーリーライン';
      case 'sequence': return 'シークエンス';
      case 'scene': return 'シーン';
      case 'action': return 'アクション';
      default: return 'ノード';
    }
  }, []);
  
  const handleNodeUpdate = useCallback((nodeId: string, newData: Partial<StoryNodeData>) => {
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...newData
            }
          };
        }
        return node;
      });
    });
  }, [setNodes]);
  
  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    
    const hasChildren = edges.some(edge => edge.source === selectedNode.id);
    
    if (hasChildren) {
      if (!confirm('このノードを削除すると、すべての子ノードも削除されます。よろしいですか？')) {
        return;
      }
      
      const getAllDescendants = (nodeId: string, acc: string[] = []): string[] => {
        const childEdges = edges.filter(edge => edge.source === nodeId);
        const childNodes = childEdges.map(edge => edge.target);
        
        acc.push(nodeId);
        childNodes.forEach(childId => {
          getAllDescendants(childId, acc);
        });
        
        return acc;
      };
      
      const nodesToDelete = getAllDescendants(selectedNode.id);
      
      setNodes((nds) => nds.filter((node) => !nodesToDelete.includes(node.id)));
      setEdges((eds) => 
        eds.filter((edge) => 
          !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
        )
      );
    } else {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => 
        eds.filter((edge) => 
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
    }
    
    setSelectedNode(null);
    toast.success('ノードを削除しました');
  }, [selectedNode, edges, setNodes, setEdges]);
  
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
          setNodes(initialStoryNodes);
          setEdges(initialStoryEdges);
          toast.success('初期データを読み込みました');
          
          setTimeout(() => {
            reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
          }, 100);
        }
      } else {
        setNodes(initialStoryNodes);
        setEdges(initialStoryEdges);
        toast.success('初期データを読み込みました');
        
        setTimeout(() => {
          reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
        }, 100);
      }
    } catch (error) {
      console.error('Flow loading error:', error);
      setNodes(initialStoryNodes);
      setEdges(initialStoryEdges);
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
    setNodes(initialStoryNodes);
    setEdges(initialStoryEdges);
    
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
    }, 100);
    
    toast.success('初期データに戻しました');
  }, [setNodes, setEdges, reactFlowInstance]);
  
  const toggleTimeline = useCallback(() => {
    setShowTimeline(prev => !prev);
  }, []);
  
  return (
    <div className="w-full h-full flex flex-col">
      <div className={`flex-1 ${showTimeline ? 'h-[calc(100%-180px)]' : 'h-[calc(100%-40px)]'}`} style={{ minHeight: "300px" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          className="bg-gray-50"
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
              <Button size="sm" variant="outline" onClick={() => addNewNode('story')}>
                <BookText className="h-4 w-4 mr-1" />
                ストーリーライン構成
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
                variant={showTimeline ? "default" : "outline"}
                onClick={toggleTimeline}
                className={showTimeline ? "bg-blue-500 hover:bg-blue-600 text-white" : ""}
              >
                <Clock className="h-4 w-4 mr-1" />
                ツリー
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
                <Button size="sm" onClick={() => addNewNode('story')} className="justify-start">
                  <BookText size={14} className="mr-2" />
                  ストーリーライン構成
                </Button>
                <Button size="sm" onClick={() => addNewNode('storyline')} className="justify-start">
                  <Route size={14} className="mr-2" />
                  ストーリーライン
                </Button>
                <Button size="sm" onClick={() => addNewNode('sequence')} className="justify-start">
                  <Layout size={14} className="mr-2" />
                  シークエンス
                </Button>
                <Button size="sm" onClick={() => addNewNode('scene')} className="justify-start">
                  <Film size={14} className="mr-2" />
                  シーン
                </Button>
                <Button size="sm" onClick={() => addNewNode('action')} className="justify-start">
                  <UserCircle size={14} className="mr-2" />
                  アクション
                </Button>
                
                {selectedNode && (
                  <>
                    <div className="h-px bg-gray-200 my-1"></div>
                    <p className="text-xs text-gray-500 px-2">選択中のノードに追加:</p>
                    
                    {selectedNode.data.type === 'story' && (
                      <Button size="sm" onClick={() => addNewNode('storyline', selectedNode.id)} className="justify-start">
                        <Route size={14} className="mr-2" />
                        ストーリーライン追加
                      </Button>
                    )}
                    
                    {selectedNode.data.type === 'storyline' && (
                      <Button size="sm" onClick={() => addNewNode('sequence', selectedNode.id)} className="justify-start">
                        <Layout size={14} className="mr-2" />
                        シークエンス追加
                      </Button>
                    )}
                    
                    {selectedNode.data.type === 'sequence' && (
                      <Button size="sm" onClick={() => addNewNode('scene', selectedNode.id)} className="justify-start">
                        <Film size={14} className="mr-2" />
                        シーン追加
                      </Button>
                    )}
                    
                    {selectedNode.data.type === 'scene' && (
                      <Button size="sm" onClick={() => addNewNode('action', selectedNode.id)} className="justify-start">
                        <UserCircle size={14} className="mr-2" />
                        アクション追加
                      </Button>
                    )}
                  </>
                )}
                
                <Button size="sm" variant="outline" onClick={() => setShowMenu(false)}>閉じる</Button>
              </div>
            </div>
          )}
        </ReactFlow>
      </div>
      
      {showTimeline ? (
        <>
          <div className="h-140 border-t border-gray-200">
            <TimelineView 
              nodes={nodes} 
              onNodeClick={handleTimelineNodeClick}
              selectedNodeId={selectedNode?.id || null}
            />
          </div>
          
          <div className="h-40 border-t border-gray-200">
            <NodeDetailPanel
              selectedNode={selectedNode}
              onNodeUpdate={handleNodeUpdate}
            />
          </div>
        </>
      ) : (
        <div className="h-40 mt-2 border-t border-gray-200">
          <NodeDetailPanel
            selectedNode={selectedNode}
            onNodeUpdate={handleNodeUpdate}
          />
        </div>
      )}

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
