
import { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Edit2 } from 'lucide-react';

export interface StoryNodeData {
  label: string;
  description: string;
  phase: 'ki' | 'sho' | 'ten' | 'ketsu';
}

interface StoryNodeProps {
  id: string;
  data: StoryNodeData;
  isConnectable: boolean;
  selected: boolean;
}

const StoryNode = ({ id, data, isConnectable, selected }: StoryNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine color class based on phase
  let nodeClass = '';
  switch (data.phase) {
    case 'ki':
      nodeClass = 'node-ki';
      break;
    case 'sho':
      nodeClass = 'node-sho';
      break;
    case 'ten':
      nodeClass = 'node-ten';
      break;
    case 'ketsu':
      nodeClass = 'node-ketsu';
      break;
    default:
      nodeClass = '';
  }

  return (
    <div 
      className={cn(
        "w-[220px] bg-white rounded-md overflow-hidden transition-all duration-300",
        nodeClass,
        selected ? "shadow-md" : "shadow-sm",
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
      
      <div className="px-3 py-2 bg-gray-50 border-b font-medium text-sm flex items-center justify-between">
        <span>{data.label}</span>
        <div className={cn("transition-opacity", isHovered || selected ? "opacity-100" : "opacity-0")}>
          <button className="p-1 rounded-md hover:bg-gray-200 transition-colors">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-3 text-sm text-gray-600 min-h-[80px]">
        {data.description || 
          <span className="text-gray-400 flex items-center gap-1">
            <Edit2 size={14} />
            説明を追加...
          </span>
        }
      </div>
      
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
