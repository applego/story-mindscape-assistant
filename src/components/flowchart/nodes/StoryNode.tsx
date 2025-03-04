
import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Edit2, UserCircle, BookText, Route, Layout, Film, MessageCircle, Clock } from 'lucide-react';
import { StoryNodeData } from '../storyStructureTypes';

interface StoryNodeProps {
  id: string;
  data: StoryNodeData;
  isConnectable: boolean;
  selected: boolean;
}

const StoryNode = ({ id, data, isConnectable, selected }: StoryNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getBgColor = () => {
    const nodeType = data.type;
    
    switch (nodeType) {
      case 'story': return 'bg-indigo-50 border-indigo-400';
      case 'storyline': return 'bg-blue-50 border-blue-400';
      case 'sequence': return 'bg-green-50 border-green-400';
      case 'scene': 
        if (data.phase === 'ki') return 'bg-blue-50 border-blue-400';
        if (data.phase === 'sho') return 'bg-green-50 border-green-400';
        if (data.phase === 'ten') return 'bg-orange-50 border-orange-400';
        if (data.phase === 'ketsu') return 'bg-purple-50 border-purple-400';
        return 'bg-cyan-50 border-cyan-400';
      case 'action': return 'bg-yellow-50 border-yellow-400';
      default: return 'bg-gray-50 border-gray-400';
    }
  };

  const getHeaderColor = () => {
    const nodeType = data.type;
    
    switch (nodeType) {
      case 'story': return 'bg-indigo-100';
      case 'storyline': return 'bg-blue-100';
      case 'sequence': return 'bg-green-100';
      case 'scene': 
        if (data.phase === 'ki') return 'bg-blue-100';
        if (data.phase === 'sho') return 'bg-green-100';
        if (data.phase === 'ten') return 'bg-orange-100';
        if (data.phase === 'ketsu') return 'bg-purple-100';
        return 'bg-cyan-100';
      case 'action': return 'bg-yellow-100';
      default: return 'bg-gray-100';
    }
  };

  const getNodeIcon = () => {
    const nodeType = data.type;
    
    switch (nodeType) {
      case 'story': return <BookText size={14} />;
      case 'storyline': return <Route size={14} />;
      case 'sequence': return <Layout size={14} />;
      case 'scene': return <Film size={14} />;
      case 'action': 
        if (data.actionType === 'dialogue') return <MessageCircle size={14} />;
        return <UserCircle size={14} />;
      default: return <Edit2 size={14} />;
    }
  };

  const getNodeTypeLabel = () => {
    const nodeType = data.type;
    
    switch (nodeType) {
      case 'story': return 'ストーリー';
      case 'storyline': return 'ストーリーライン';
      case 'sequence': return 'シークエンス';
      case 'scene': return 'シーン';
      case 'action': 
        if (data.actionType === 'dialogue') return '台詞';
        if (data.actionType === 'reaction') return 'リアクション';
        if (data.actionType === 'thought') return '思考';
        return 'アクション';
      default: return '';
    }
  };

  const getNodeWidth = () => {
    const nodeType = data.type;
    
    switch (nodeType) {
      case 'story': return 'w-[280px]';
      case 'storyline': return 'w-[240px]';
      case 'sequence': return 'w-[220px]';
      case 'scene': return 'w-[220px]';
      case 'action': return 'w-[200px]';
      default: return 'w-[200px]';
    }
  };

  return (
    <div 
      className={cn(
        getNodeWidth(),
        "rounded-md overflow-hidden transition-all duration-300 border",
        getBgColor(),
        selected ? "shadow-md ring-2 ring-blue-400 ring-opacity-50" : "shadow-sm",
        isHovered ? "shadow-md" : ""
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
      
      <div className={cn("px-3 py-2 font-medium text-sm flex items-center justify-between", getHeaderColor())}>
        <div className="flex items-center gap-1">
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white text-xs border">
            {getNodeIcon()}
          </span>
          <span className="ml-1 text-xs text-gray-600">{getNodeTypeLabel()}</span>
          <span className="ml-1">{data.title || 'タイトルなし'}</span>
        </div>
        
        <div className={cn("transition-opacity", isHovered || selected ? "opacity-100" : "opacity-0")}>
          <button className="p-1 rounded-md hover:bg-gray-200/50 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-3 text-sm text-gray-600 min-h-[60px]">
        {data.description || 
          <span className="text-gray-400 flex items-center gap-1">
            <Edit2 size={14} />
            説明を追加...
          </span>
        }
        
        {typeof data.timePosition === 'number' && data.timePosition > 0 && (
          <div className="mt-2 text-xs flex items-center text-gray-500">
            <Clock size={12} className="mr-1" />
            時系列位置: {data.timePosition}
          </div>
        )}
      </div>
      
      {data.characters && data.characters.length > 0 && (
        <div className="px-3 pb-3 flex flex-wrap gap-1">
          {data.characters.map((char, idx) => (
            <div key={idx} className="flex items-center text-xs bg-white/70 px-1.5 py-0.5 rounded-full">
              <UserCircle size={12} className="mr-1" />
              {char}
            </div>
          ))}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3"
      />
    </div>
  );
};

export default memo(StoryNode);
