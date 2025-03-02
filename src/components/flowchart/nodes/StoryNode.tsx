
import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Edit2, UserCircle } from 'lucide-react';

export interface StoryNodeData {
  label: string;
  description: string;
  phase: 'ki' | 'sho' | 'ten' | 'ketsu';
  characters?: string[];
}

interface StoryNodeProps {
  id: string;
  data: StoryNodeData;
  isConnectable: boolean;
  selected: boolean;
}

const StoryNode = ({ id, data, isConnectable, selected }: StoryNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // フェーズに基づくスタイルを決定
  const getBgColor = () => {
    switch (data.phase) {
      case 'ki': return 'bg-blue-50 border-blue-400';
      case 'sho': return 'bg-green-50 border-green-400';
      case 'ten': return 'bg-orange-50 border-orange-400';
      case 'ketsu': return 'bg-purple-50 border-purple-400';
      default: return 'bg-gray-50 border-gray-400';
    }
  };

  const getHeaderColor = () => {
    switch (data.phase) {
      case 'ki': return 'bg-blue-100';
      case 'sho': return 'bg-green-100';
      case 'ten': return 'bg-orange-100';
      case 'ketsu': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  };

  const getLabel = () => {
    switch (data.phase) {
      case 'ki': return '起';
      case 'sho': return '承';
      case 'ten': return '転';
      case 'ketsu': return '結';
      default: return '';
    }
  };

  return (
    <div 
      className={cn(
        "w-[220px] rounded-md overflow-hidden transition-all duration-300 border",
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
            {getLabel()}
          </span>
          <span>{data.label}</span>
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
