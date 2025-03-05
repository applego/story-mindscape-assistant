import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Edit2, UserCircle, BookText, Route, Layout, Film, MessageCircle, Clock, FileText } from 'lucide-react';
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
    
    const hasContent = data.content && String(data.content).trim().length > 0;
    
    switch (nodeType) {
      case 'story': 
        return hasContent 
          ? 'bg-indigo-100 border-indigo-500 dark:bg-indigo-900/40 dark:border-indigo-600' 
          : 'bg-indigo-50 border-indigo-400 dark:bg-indigo-900/30 dark:border-indigo-700';
      case 'storyline': 
        return hasContent 
          ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/40 dark:border-blue-600' 
          : 'bg-blue-50 border-blue-400 dark:bg-blue-900/30 dark:border-blue-700';
      case 'sequence': 
        return hasContent 
          ? 'bg-green-100 border-green-500 dark:bg-green-900/40 dark:border-green-600' 
          : 'bg-green-50 border-green-400 dark:bg-green-900/30 dark:border-green-700';
      case 'scene': 
        if (data.phase === 'ki') return hasContent 
          ? 'bg-blue-100 border-blue-500 dark:bg-blue-900/40 dark:border-blue-600' 
          : 'bg-blue-50 border-blue-400 dark:bg-blue-900/30 dark:border-blue-700';
        if (data.phase === 'sho') return hasContent 
          ? 'bg-green-100 border-green-500 dark:bg-green-900/40 dark:border-green-600' 
          : 'bg-green-50 border-green-400 dark:bg-green-900/30 dark:border-green-700';
        if (data.phase === 'ten') return hasContent 
          ? 'bg-orange-100 border-orange-500 dark:bg-orange-900/40 dark:border-orange-600' 
          : 'bg-orange-50 border-orange-400 dark:bg-orange-900/30 dark:border-orange-700';
        if (data.phase === 'ketsu') return hasContent 
          ? 'bg-purple-100 border-purple-500 dark:bg-purple-900/40 dark:border-purple-600' 
          : 'bg-purple-50 border-purple-400 dark:bg-purple-900/30 dark:border-purple-700';
        return hasContent 
          ? 'bg-cyan-100 border-cyan-500 dark:bg-cyan-900/40 dark:border-cyan-600' 
          : 'bg-cyan-50 border-cyan-400 dark:bg-cyan-900/30 dark:border-cyan-700';
      case 'action': 
        return hasContent 
          ? 'bg-yellow-100 border-yellow-500 dark:bg-yellow-900/40 dark:border-yellow-600' 
          : 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/30 dark:border-yellow-700';
      default: 
        return hasContent 
          ? 'bg-gray-100 border-gray-500 dark:bg-gray-800 dark:border-gray-600' 
          : 'bg-gray-50 border-gray-400 dark:bg-gray-900 dark:border-gray-700';
    }
  };

  const getHeaderColor = () => {
    const nodeType = data.type;
    const hasContent = data.content && String(data.content).trim().length > 0;
    
    switch (nodeType) {
      case 'story': 
        return hasContent 
          ? 'bg-indigo-200 dark:bg-indigo-800/50' 
          : 'bg-indigo-100 dark:bg-indigo-900/40';
      case 'storyline': 
        return hasContent 
          ? 'bg-blue-200 dark:bg-blue-800/50' 
          : 'bg-blue-100 dark:bg-blue-900/40';
      case 'sequence': 
        return hasContent 
          ? 'bg-green-200 dark:bg-green-800/50' 
          : 'bg-green-100 dark:bg-green-900/40';
      case 'scene': 
        if (data.phase === 'ki') return hasContent 
          ? 'bg-blue-200 dark:bg-blue-800/50' 
          : 'bg-blue-100 dark:bg-blue-900/40';
        if (data.phase === 'sho') return hasContent 
          ? 'bg-green-200 dark:bg-green-800/50' 
          : 'bg-green-100 dark:bg-green-900/40';
        if (data.phase === 'ten') return hasContent 
          ? 'bg-orange-200 dark:bg-orange-800/50' 
          : 'bg-orange-100 dark:bg-orange-900/40';
        if (data.phase === 'ketsu') return hasContent 
          ? 'bg-purple-200 dark:bg-purple-800/50' 
          : 'bg-purple-100 dark:bg-purple-900/40';
        return hasContent 
          ? 'bg-cyan-200 dark:bg-cyan-800/50' 
          : 'bg-cyan-100 dark:bg-cyan-900/40';
      case 'action': 
        return hasContent 
          ? 'bg-yellow-200 dark:bg-yellow-800/50' 
          : 'bg-yellow-100 dark:bg-yellow-900/40';
      default: 
        return hasContent 
          ? 'bg-gray-200 dark:bg-gray-700' 
          : 'bg-gray-100 dark:bg-gray-800';
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

  const hasContent = data.content && String(data.content).trim().length > 0;

  return (
    <div 
      className={cn(
        getNodeWidth(),
        "rounded-md overflow-hidden transition-all duration-300 border",
        getBgColor(),
        selected ? "shadow-md ring-2 ring-blue-400 ring-opacity-50 dark:ring-blue-500 dark:ring-opacity-70" : "shadow-sm",
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
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-xs border dark:border-gray-600">
            {getNodeIcon()}
          </span>
          <span className="ml-1 text-xs text-gray-600 dark:text-gray-300">{getNodeTypeLabel()}</span>
          <span className="ml-1">{data.title || 'タイトルなし'}</span>
        </div>
        
        <div className={cn("transition-opacity flex items-center gap-1", isHovered || selected ? "opacity-100" : "opacity-0")}>
          {hasContent && (
            <span className="w-4 h-4 flex items-center justify-center">
              <FileText size={12} className="text-green-600 dark:text-green-400" />
            </span>
          )}
          <button className="p-1 rounded-md hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-3 text-sm text-gray-600 dark:text-gray-300 min-h-[60px]">
        {data.description || 
          <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Edit2 size={14} />
            説明を追加...
          </span>
        }
        
        {typeof data.timePosition === 'number' && data.timePosition > 0 && (
          <div className="mt-2 text-xs flex items-center text-gray-500 dark:text-gray-400">
            <Clock size={12} className="mr-1" />
            時系列位置: {data.timePosition}
          </div>
        )}
        
        {hasContent && (
          <div className="mt-2 text-xs bg-white/70 dark:bg-gray-800/70 p-1.5 rounded border border-gray-200 dark:border-gray-700 line-clamp-2">
            {String(data.content).substring(0, 100)}
            {String(data.content).length > 100 && '...'}
          </div>
        )}
      </div>
      
      {data.characters && data.characters.length > 0 && (
        <div className="px-3 pb-3 flex flex-wrap gap-1">
          {data.characters.map((char, idx) => (
            <div key={idx} className="flex items-center text-xs bg-white/70 dark:bg-gray-800/70 px-1.5 py-0.5 rounded-full dark:text-gray-300 border border-gray-200 dark:border-gray-700">
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
