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
  NodeChange,
  NodePositionChange
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
  ArrowDownUp,
  FileSymlink,
  Sparkles,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { StoryNodeData, FlowStoryNode } from './storyStructureTypes';
import PlotInitializer from '../plotCreator/PlotInitializer';
import AuthorSettingsModal from './AuthorSettingsModal';
import StoryGenerationModal from './StoryGenerationModal';
import { 
  AuthorInfo, 
  defaultAuthorInfo, 
  getAllParentNodes, 
  getAllDescendantNodes,
  createGenerationPrompt,
  generateContent
} from '@/utils/storyGenerationUtils';

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
  const [showPlotInitializer, setShowPlotInitializer] = useState(false);
  
  const [authorInfo, setAuthorInfo] = useState<AuthorInfo>(defaultAuthorInfo);
  const [showAuthorSettings, setShowAuthorSettings] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [nodesToGenerate, setNodesToGenerate] = useState<Node<StoryNodeData>[]>([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<{ id: string; content: string }[]>([]);
  
  const reactFlowInstance = useReactFlow();
  const timelineViewRef = useRef(null);

  useEffect(() => {
    try {
      const savedFlow = localStorage.getItem('storyflow');
      if (!savedFlow || JSON.parse(savedFlow).nodes.length === 0) {
        setShowPlotInitializer(true);
      } else {
        loadSavedFlow();
      }
    } catch (error) {
      console.error('Error checking saved flow:', error);
      setShowPlotInitializer(true);
    }
    
    try {
      const savedAuthorInfo = localStorage.getItem('authorInfo');
      if (savedAuthorInfo) {
        setAuthorInfo(JSON.parse(savedAuthorInfo));
      }
    } catch (error) {
      console.error('Error loading author info:', error);
    }
  }, []);
  
  useEffect(() => {
    console.log('Nodes updated, synchronizing with timeline view');
  }, [nodes]);
  
  const getAllDescendantIds = useCallback((nodeId: string): string[] => {
    const descendants: string[] = [];
    const stack: string[] = [nodeId];
    
    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const childEdges = edges.filter(edge => edge.source === currentId);
      const childIds = childEdges.map(edge => edge.target);
      
      childIds.forEach(id => {
        descendants.push(id);
        stack.push(id);
      });
    }
    
    return descendants;
  }, [edges]);
  
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes as NodeChange<Node<StoryNodeData>>[]);
    
    const positionChanges = changes.filter(
      change => change.type === 'position' && change.dragging
    ) as NodePositionChange[];
    
    if (positionChanges.length > 0) {
      const nodeDeltaPositions = new Map<string, { dx: number, dy: number }>();
      
      positionChanges.forEach(change => {
        const node = nodes.find(n => n.id === change.id);
        if (node && change.position) {
          const dx = change.position.x - node.position.x;
          const dy = change.position.y - node.position.y;
          nodeDeltaPositions.set(change.id, { dx, dy });
          
          const descendantIds = getAllDescendantIds(change.id);
          
          setNodes(nds => {
            return nds.map(n => {
              if (n.id === change.id) {
                return {
                  ...n,
                  position: change.position
                };
              }
              
              if (descendantIds.includes(n.id)) {
                return {
                  ...n,
                  position: {
                    x: n.position.x + dx,
                    y: n.position.y + dy
                  }
                };
              }
              
              return n;
            });
          });
        }
      });
    }
  }, [nodes, onNodesChange, setNodes, getAllDescendantIds]);
  
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
    
    const sourceNode = nodes.find(n => n.id === params.source);
    const targetNode = nodes.find(n => n.id === params.target);
    
    if (sourceNode && targetNode) {
      setNodes(nds => 
        nds.map(node => {
          if (node.id === targetNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                parentId: sourceNode.id
              }
            };
          }
          return node;
        })
      );
    }
    
    toast.success('ノード間の接続を作成しました');
  }, [nodes, setEdges, setNodes]);
  
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
    const maxTimePosition = nodes
      .filter(n => n.data.type === type)
      .reduce((max, node) => {
        const pos = typeof node.data.timePosition === 'number' ? node.data.timePosition : 0;
        return pos > max ? pos : max;
      }, 0);
    
    const newTimePosition = maxTimePosition + 10;
    
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
        timePosition: newTimePosition,
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
  }, [menuPosition, setNodes, setEdges, nodes]);
  
  const getNodeTypeLabel = useCallback((type: string) => {
    switch (type) {
      case 'story': return 'ストーリー';
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
    
    if (newData.title) {
      console.log(`Node title updated: ${newData.title}`);
    }
  }, [setNodes]);
  
  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;
    
    const descendantIds = getAllDescendantIds(selectedNode.id);
    const nodesToDelete = [selectedNode.id, ...descendantIds];
    
    if (descendantIds.length > 0) {
      if (!confirm(`このノードを削除すると、${descendantIds.length}個の子孫ノードも削除されます。よろしいですか？`)) {
        return;
      }
    }
    
    setNodes((nds) => nds.filter((node) => !nodesToDelete.includes(node.id)));
    setEdges((eds) => 
      eds.filter((edge) => 
        !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
      )
    );
    
    setSelectedNode(null);
    toast.success('ノードを削除しました');
  }, [selectedNode, getAllDescendantIds, setNodes, setEdges]);
  
  const saveFlow = useCallback(() => {
    const flow = reactFlowInstance.toObject();
    localStorage.setItem('storyflow', JSON.stringify(flow));
    toast.success('ストーリーフローを保存しました');
    
    localStorage.setItem('authorInfo', JSON.stringify(authorInfo));
  }, [reactFlowInstance, authorInfo]);
  
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
  
  const handleTimelineNodesUpdate = useCallback((updatedNodes: Node<StoryNodeData>[]) => {
    setNodes(updatedNodes);
    
    requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
    });
  }, [setNodes, reactFlowInstance]);
  
  const handleCreatePlot = useCallback((newNodes: Node<StoryNodeData>[]) => {
    const newEdges: Edge[] = [];
    
    for (let i = 0; i < newNodes.length - 1; i++) {
      newEdges.push({
        id: `edge-${newNodes[i].id}-${newNodes[i+1].id}`,
        source: newNodes[i].id,
        target: newNodes[i+1].id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#555' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    
    setTimeout(() => {
      if (reactFlowInstance) {
        reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
      }
    }, 100);
    
    setTimeout(() => {
      saveFlow();
    }, 200);
    
    toast.success('新しいプロットを作成しました');
  }, [setNodes, setEdges, reactFlowInstance, saveFlow]);
  
  const handleNewPlot = useCallback(() => {
    if (nodes.length > 0) {
      const confirmed = confirm('現在のプロットを破棄して新しいプロットを作成しますか？');
      if (!confirmed) return;
    }
    
    setShowPlotInitializer(true);
  }, [nodes]);
  
  const handleStartGeneration = useCallback(() => {
    if (!selectedNode) {
      toast.error('ノードが選択されていません');
      return;
    }
    
    const descendants = getAllDescendantNodes(selectedNode.id, nodes, edges);
    const allNodesToGenerate = [selectedNode, ...descendants];
    
    setNodesToGenerate(allNodesToGenerate);
    setGenerationProgress(0);
    setIsGenerating(true);
    setGeneratedResults([]);
    setShowGenerationModal(true);
    
    const generateStories = async () => {
      const results: { id: string; content: string }[] = [];
      
      for (let i = 0; i < allNodesToGenerate.length; i++) {
        const node = allNodesToGenerate[i];
        
        try {
          const parentNodes = getAllParentNodes(node.id, nodes, edges);
          const prompt = createGenerationPrompt(node, parentNodes, authorInfo);
          const content = await generateContent(prompt);
          
          results.push({
            id: node.id,
            content
          });
          
          const progress = Math.round(((i + 1) / allNodesToGenerate.length) * 100);
          setGenerationProgress(progress);
          setGeneratedResults([...results]);
        } catch (error) {
          console.error(`Error generating content for node ${node.id}:`, error);
          toast.error(`ノード「${node.data.title}」の文章生成に失敗しました`);
        }
      }
      
      setIsGenerating(false);
    };
    
    generateStories();
  }, [selectedNode, nodes, edges, authorInfo]);
  
  const handleApplyGeneratedContent = useCallback((results: { id: string; content: string }[]) => {
    setNodes(nds => {
      return nds.map(node => {
        const result = results.find(r => r.id === node.id);
        if (result) {
          return {
            ...node,
            data: {
              ...node.data,
              content: result.content
            }
          };
        }
        return node;
      });
    });
    
    toast.success('生成された文章を適用しました');
    setShowGenerationModal(false);
    
    setTimeout(saveFlow, 100);
  }, [setNodes, saveFlow]);
  
  const handleSaveAuthorSettings = useCallback((newAuthorInfo: AuthorInfo) => {
    setAuthorInfo(newAuthorInfo);
    localStorage.setItem('authorInfo', JSON.stringify(newAuthorInfo));
    toast.success('作家設定を保存しました');
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
          className="bg-gray-50 dark:bg-storyflow-dark-gray"
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
              <Button size="sm" variant="outline" onClick={handleNewPlot}>
                <FileSymlink className="h-4 w-4 mr-1" />
                新規プロット
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
              <div className="p-3 bg-white rounded-lg shadow-md flex gap-2">
                <Button 
                  size="sm" 
                  variant="default" 
                  onClick={handleStartGeneration}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  文章生成
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowAuthorSettings(true)}
                >
                  <Settings className="h-4 w-4 mr-1" />
                  作家設定
                </Button>
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
              className="dark:bg-storyflow-dark-gray dark:text-storyflow-dark-text"
            >
              <div className="flex flex-col gap-2">
                <Button size="sm" onClick={() => addNewNode('story')} className="justify-start">
                  <BookText size={14} className="mr-2" />
                  ストーリー
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
          <div className="h-140 border-t border-gray-200 dark:border-gray-700">
            <TimelineView 
              ref={timelineViewRef}
              nodes={nodes} 
              onNodeClick={handleTimelineNodeClick}
              selectedNodeId={selectedNode?.id || null}
              onNodesUpdate={handleTimelineNodesUpdate}
            />
          </div>
          
          <div className="h-40 border-t border-gray-200 dark:border-gray-700">
            <NodeDetailPanel
              selectedNode={selectedNode}
              onNodeUpdate={handleNodeUpdate}
            />
          </div>
        </>
      ) : (
        <div className="h-40 mt-2 border-t border-gray-200 dark:border-gray-700">
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

      <PlotInitializer 
        isOpen={showPlotInitializer}
        onClose={() => setShowPlotInitializer(false)}
        onCreatePlot={handleCreatePlot}
      />

      <AuthorSettingsModal
        isOpen={showAuthorSettings}
        onClose={() => setShowAuthorSettings(false)}
        authorInfo={authorInfo}
        onSave={handleSaveAuthorSettings}
      />

      <StoryGenerationModal
        isOpen={showGenerationModal}
        onClose={() => setShowGenerationModal(false)}
        nodesToGenerate={nodesToGenerate}
        onGenerationComplete={handleApplyGeneratedContent}
        generationProgress={generationProgress}
        isGenerating={isGenerating}
        generatedResults={generatedResults}
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
