
import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, ArrowRight } from 'lucide-react';

interface TimelineViewProps {
  nodes: Node<StoryNodeData>[];
  onNodeClick: (nodeId: string) => void;
  selectedNodeId: string | null;
}

const TimelineView: React.FC<TimelineViewProps> = ({ nodes, onNodeClick, selectedNodeId }) => {
  const [timelineNodes, setTimelineNodes] = useState<Node<StoryNodeData>[]>([]);

  useEffect(() => {
    // シーンとアクションのノードだけをフィルタリング
    const filteredNodes = nodes.filter(
      (node) => node.data.type === 'scene' || node.data.type === 'action'
    );

    // 親子関係を考慮してソート
    const sortedNodes = [...filteredNodes].sort((a, b) => {
      // 同じ親を持つノード同士を比較
      if (a.data.parentId === b.data.parentId) {
        // timePositionがある場合はそれを使用
        if ('timePosition' in a.data && 'timePosition' in b.data && 
            a.data.timePosition !== undefined && b.data.timePosition !== undefined) {
          return a.data.timePosition - b.data.timePosition;
        }
        // そうでなければポジションのX座標でソート
        return a.position.x - b.position.x;
      }
      
      // 親が異なる場合はシーン→アクションの順にする
      if (a.data.type === 'scene' && b.data.type === 'action') return -1;
      if (a.data.type === 'action' && b.data.type === 'scene') return 1;
      
      return 0;
    });

    setTimelineNodes(sortedNodes);
  }, [nodes]);

  const getNodeColor = (node: Node<StoryNodeData>) => {
    if (node.data.type === 'scene') {
      if (node.data.phase === 'ki') return 'bg-blue-100 border-blue-400';
      if (node.data.phase === 'sho') return 'bg-green-100 border-green-400';
      if (node.data.phase === 'ten') return 'bg-orange-100 border-orange-400';
      if (node.data.phase === 'ketsu') return 'bg-purple-100 border-purple-400';
      return 'bg-cyan-100 border-cyan-400';
    } else if (node.data.type === 'action') {
      if (node.data.actionType === 'dialogue') return 'bg-yellow-100 border-yellow-400';
      if (node.data.actionType === 'reaction') return 'bg-pink-100 border-pink-400';
      if (node.data.actionType === 'thought') return 'bg-indigo-100 border-indigo-400';
      return 'bg-yellow-100 border-yellow-400';
    }
    return 'bg-gray-100 border-gray-400';
  };

  const getNodeIcon = (node: Node<StoryNodeData>) => {
    if (node.data.type === 'scene') {
      return <Clock className="h-3 w-3 mr-1" />;
    } else if (node.data.type === 'action' && node.data.actionType === 'dialogue') {
      return <ArrowRight className="h-3 w-3 mr-1" />;
    }
    return <ArrowRight className="h-3 w-3 mr-1" />;
  };

  return (
    <div className="h-full border-t border-gray-200 pt-2">
      <div className="flex items-center justify-between px-4 py-2">
        <h3 className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          時系列ビュー
        </h3>
      </div>
      
      <ScrollArea className="h-[calc(100%-40px)]">
        <div className="px-4 pb-4">
          <div className="relative">
            {/* 時間軸 */}
            <div className="absolute left-0 top-3 bottom-0 w-0.5 bg-gray-300 z-0"></div>
            
            {/* ノード */}
            <div className="space-y-2 relative z-10">
              {timelineNodes.map((node) => (
                <div
                  key={node.id}
                  className={`
                    ml-4 pl-3 pr-2 py-1.5 rounded-md border text-xs 
                    ${getNodeColor(node)}
                    ${selectedNodeId === node.id ? 'ring-2 ring-blue-500' : ''}
                    cursor-pointer hover:shadow-sm transition-shadow
                  `}
                  onClick={() => onNodeClick(node.id)}
                >
                  <div className="absolute left-0 top-[50%] w-4 h-px bg-gray-300"></div>
                  <div className="absolute left-[-5px] top-[50%] transform -translate-y-1/2 w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"></div>
                  
                  <div className="flex items-center">
                    {getNodeIcon(node)}
                    <span className="font-medium">{node.data.title}</span>
                  </div>
                  
                  {node.data.description && (
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {node.data.description}
                    </p>
                  )}
                  
                  {node.data.characters && node.data.characters.length > 0 && (
                    <div className="mt-1 text-[10px] text-gray-500">
                      登場: {node.data.characters.join(', ')}
                    </div>
                  )}
                </div>
              ))}
              
              {timelineNodes.length === 0 && (
                <div className="ml-4 py-3 text-gray-500 text-xs italic">
                  シーン/アクションが追加されていません
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default TimelineView;
