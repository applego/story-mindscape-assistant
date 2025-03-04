
import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  ChevronDown, 
  Film, 
  Route, 
  Layout,
  BookText,
  UserCircle,
  MoveVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface TimelineViewProps {
  nodes: Node<StoryNodeData>[];
  onNodeClick: (nodeId: string) => void;
  selectedNodeId: string | null;
  onNodesUpdate: (updatedNodes: Node<StoryNodeData>[]) => void;
}

interface TreeNode {
  id: string;
  node: Node<StoryNodeData>;
  children: TreeNode[];
  isOpen: boolean;
}

const TimelineView: React.FC<TimelineViewProps> = ({ 
  nodes, 
  onNodeClick, 
  selectedNodeId,
  onNodesUpdate 
}) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [reorderMode, setReorderMode] = useState(false);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'time' | 'writing'>('time');

  useEffect(() => {
    // ツリー構造を構築
    const buildTree = () => {
      // ノードをタイプでグループ化
      const storyNodes = nodes.filter(node => node.data.type === 'story');
      const storylineNodes = nodes.filter(node => node.data.type === 'storyline');
      const sequenceNodes = nodes.filter(node => node.data.type === 'sequence');
      const sceneNodes = nodes.filter(node => node.data.type === 'scene');
      const actionNodes = nodes.filter(node => node.data.type === 'action');
      
      // ツリーを構築
      const tree: TreeNode[] = [];
      
      // 物語ノードを追加
      storyNodes.forEach(storyNode => {
        const storyItem: TreeNode = {
          id: storyNode.id,
          node: storyNode,
          children: [],
          isOpen: true
        };
        
        // 関連するストーリーラインを追加
        storylineNodes
          .filter(node => node.data.parentId === storyNode.id)
          .sort((a, b) => {
            // タイムポジションがある場合はそれを使用
            const aTime = typeof a.data.timePosition === 'number' ? a.data.timePosition : 0;
            const bTime = typeof b.data.timePosition === 'number' ? b.data.timePosition : 0;
            if (aTime !== bTime) {
              return aTime - bTime;
            }
            return a.position.x - b.position.x;
          })
          .forEach(storylineNode => {
            const storylineItem: TreeNode = {
              id: storylineNode.id,
              node: storylineNode,
              children: [],
              isOpen: true
            };
            
            // 関連するシークエンスを追加
            sequenceNodes
              .filter(node => node.data.parentId === storylineNode.id)
              .sort((a, b) => {
                // タイムポジションがある場合はそれを使用
                const aTime = typeof a.data.timePosition === 'number' ? a.data.timePosition : 0;
                const bTime = typeof b.data.timePosition === 'number' ? b.data.timePosition : 0;
                if (aTime !== bTime) {
                  return aTime - bTime;
                }
                return a.position.x - b.position.x;
              })
              .forEach(sequenceNode => {
                const sequenceItem: TreeNode = {
                  id: sequenceNode.id,
                  node: sequenceNode,
                  children: [],
                  isOpen: true
                };
                
                // 関連するシーンを追加
                sceneNodes
                  .filter(node => node.data.parentId === sequenceNode.id)
                  .sort((a, b) => {
                    // タイムポジションがある場合はそれを使用
                    const aTime = typeof a.data.timePosition === 'number' ? a.data.timePosition : 0;
                    const bTime = typeof b.data.timePosition === 'number' ? b.data.timePosition : 0;
                    if (aTime !== bTime) {
                      return aTime - bTime;
                    }
                    return a.position.x - b.position.x;
                  })
                  .forEach(sceneNode => {
                    const sceneItem: TreeNode = {
                      id: sceneNode.id,
                      node: sceneNode,
                      children: [],
                      isOpen: true
                    };
                    
                    // 関連するアクションを追加
                    actionNodes
                      .filter(node => node.data.parentId === sceneNode.id)
                      .sort((a, b) => {
                        // タイムポジションがある場合はそれを使用
                        const aTime = typeof a.data.timePosition === 'number' ? a.data.timePosition : 0;
                        const bTime = typeof b.data.timePosition === 'number' ? b.data.timePosition : 0;
                        if (aTime !== bTime) {
                          return aTime - bTime;
                        }
                        return a.position.x - b.position.x;
                      })
                      .forEach(actionNode => {
                        sceneItem.children.push({
                          id: actionNode.id,
                          node: actionNode,
                          children: [],
                          isOpen: true
                        });
                      });
                    
                    sequenceItem.children.push(sceneItem);
                  });
                
                storylineItem.children.push(sequenceItem);
              });
            
            storyItem.children.push(storylineItem);
          });
        
        tree.push(storyItem);
      });
      
      return tree;
    };
    
    setTreeData(buildTree());
  }, [nodes]); // nodes依存配列で更新を即時反映

  const toggleNode = (nodeId: string) => {
    const updateNodeOpenState = (items: TreeNode[]): TreeNode[] => {
      return items.map(item => {
        if (item.id === nodeId) {
          return { ...item, isOpen: !item.isOpen };
        }
        
        if (item.children.length > 0) {
          return { ...item, children: updateNodeOpenState(item.children) };
        }
        
        return item;
      });
    };
    
    setTreeData(updateNodeOpenState(treeData));
  };

  const getNodeIcon = (node: Node<StoryNodeData>) => {
    const type = node.data.type;
    
    switch (type) {
      case 'story': return <BookText size={14} className="min-w-[14px]" />;
      case 'storyline': return <Route size={14} className="min-w-[14px]" />;
      case 'sequence': return <Layout size={14} className="min-w-[14px]" />;
      case 'scene': return <Film size={14} className="min-w-[14px]" />;
      case 'action': 
        if ('actionType' in node.data && node.data.actionType === 'dialogue') {
          return <ArrowRight size={14} className="min-w-[14px]" />;
        }
        return <UserCircle size={14} className="min-w-[14px]" />;
      default: return <Clock size={14} className="min-w-[14px]" />;
    }
  };

  const getNodeColor = (node: Node<StoryNodeData>) => {
    if (node.data.type === 'scene') {
      if (node.data.phase === 'ki') return 'bg-blue-50 border-blue-400 text-blue-800';
      if (node.data.phase === 'sho') return 'bg-green-50 border-green-400 text-green-800';
      if (node.data.phase === 'ten') return 'bg-orange-50 border-orange-400 text-orange-800';
      if (node.data.phase === 'ketsu') return 'bg-purple-50 border-purple-400 text-purple-800';
      return 'bg-cyan-50 border-cyan-400 text-cyan-800';
    } else if (node.data.type === 'action') {
      if ('actionType' in node.data) {
        if (node.data.actionType === 'dialogue') return 'bg-yellow-50 border-yellow-400 text-yellow-800';
        if (node.data.actionType === 'reaction') return 'bg-pink-50 border-pink-400 text-pink-800';
        if (node.data.actionType === 'thought') return 'bg-indigo-50 border-indigo-400 text-indigo-800';
      }
      return 'bg-yellow-50 border-yellow-400 text-yellow-800';
    } else if (node.data.type === 'story') {
      return 'bg-indigo-50 border-indigo-400 text-indigo-800';
    } else if (node.data.type === 'storyline') {
      return 'bg-blue-50 border-blue-400 text-blue-800';
    } else if (node.data.type === 'sequence') {
      return 'bg-green-50 border-green-400 text-green-800';
    }
    return 'bg-gray-50 border-gray-400 text-gray-800';
  };

  // ドラッグ開始時の処理
  const handleDragStart = (nodeId: string) => {
    if (!reorderMode) return;
    setDraggedNodeId(nodeId);
  };

  // ドラッグ中にドロップ対象の上にカーソルが来たときの処理
  const handleDragOver = (e: React.DragEvent, nodeId: string) => {
    if (!reorderMode || !draggedNodeId || draggedNodeId === nodeId) return;
    e.preventDefault();
  };

  // ドロップ時の処理
  const handleDrop = (e: React.DragEvent, targetNodeId: string) => {
    if (!reorderMode || !draggedNodeId || draggedNodeId === targetNodeId) return;
    e.preventDefault();
    
    // ドラッグ中のノードと対象ノードを見つける
    const draggedNode = nodes.find(n => n.id === draggedNodeId);
    const targetNode = nodes.find(n => n.id === targetNodeId);
    
    if (!draggedNode || !targetNode) return;
    
    // 同じ階層のノードでない場合は処理しない
    if (draggedNode.data.type !== targetNode.data.type || draggedNode.data.parentId !== targetNode.data.parentId) {
      toast.error("同じ階層のノード間でのみ並び替えが可能です");
      return;
    }
    
    // タイムポジションを入れ替える
    const updatedNodes = nodes.map(node => {
      if (node.id === draggedNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            timePosition: targetNode.data.timePosition
          }
        };
      }
      if (node.id === targetNodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            timePosition: draggedNode.data.timePosition
          }
        };
      }
      return node;
    });
    
    // ノードの更新をStoryFlowEditorに通知
    onNodesUpdate(updatedNodes);
    setDraggedNodeId(null);
    
    toast.success("ノードの順序を入れ替えました");
  };

  // ドラッグ終了時の処理
  const handleDragEnd = () => {
    setDraggedNodeId(null);
  };

  const toggleReorderMode = () => {
    setReorderMode(!reorderMode);
    if (!reorderMode) {
      toast.info("ノードをドラッグ＆ドロップで並べ替えできます");
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'time' ? 'writing' : 'time');
    toast.info(`表示モード: ${viewMode === 'time' ? '執筆順' : '時系列順'}`);
  };

  const renderTreeNode = (item: TreeNode, level: number = 0) => {
    const hasChildren = item.children.length > 0;
    
    return (
      <div 
        key={item.id} 
        className="mb-1"
        draggable={reorderMode}
        onDragStart={() => handleDragStart(item.id)}
        onDragOver={(e) => handleDragOver(e, item.id)}
        onDrop={(e) => handleDrop(e, item.id)}
        onDragEnd={handleDragEnd}
      >
        <div 
          className={`
            flex items-center rounded-md pr-2 py-1 
            ${getNodeColor(item.node)}
            ${selectedNodeId === item.id ? 'ring-2 ring-blue-500' : ''}
            ${draggedNodeId === item.id ? 'opacity-50' : ''}
            ${reorderMode ? 'cursor-grab' : 'hover:bg-opacity-80 cursor-pointer'}
          `}
          style={{ paddingLeft: `${level * 8 + 4}px` }}
        >
          {hasChildren && (
            <button 
              onClick={(e) => { 
                e.stopPropagation();
                toggleNode(item.id);
              }}
              className="mr-1 p-0.5 rounded hover:bg-white/30"
            >
              {item.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          )}
          
          {!hasChildren && <div className="w-5"></div>}
          
          <div 
            className="flex items-center flex-1 min-w-0 text-xs"
            onClick={() => onNodeClick(item.id)}
          >
            <span className="mr-1">{getNodeIcon(item.node)}</span>
            <span className="font-medium truncate">{item.node.data.title}</span>
            {typeof item.node.data.timePosition === 'number' && (
              <span className="ml-1 text-xs opacity-50">({viewMode === 'time' ? 'T:' : 'W:'}{item.node.data.timePosition})</span>
            )}
          </div>
        </div>
        
        {item.isOpen && hasChildren && (
          <div className="ml-4 pl-2 border-l border-gray-200">
            {item.children.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full border-t border-gray-200 pt-2">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {viewMode === 'time' ? '時系列ツリービュー' : '執筆順ツリービュー'}
        </h3>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant={reorderMode ? "default" : "outline"} 
            onClick={toggleReorderMode}
            className={reorderMode ? "h-7 text-xs" : "h-7 text-xs"}
          >
            <MoveVertical className="h-3 w-3 mr-1" />
            並替
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={toggleViewMode}
            className="h-7 text-xs"
          >
            {viewMode === 'time' ? '執筆順' : '時系列順'}
          </Button>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="px-4 pb-4">
          {treeData.length > 0 ? (
            <div className="space-y-1">
              {treeData.map(item => renderTreeNode(item))}
            </div>
          ) : (
            <div className="py-3 text-gray-500 text-xs italic">
              ノードが追加されていません
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineView;
