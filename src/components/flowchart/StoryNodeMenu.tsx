
import { DragEvent } from 'react';
import { cn } from '@/lib/utils';

interface NodeTypeItem {
  type: string;
  phase: 'ki' | 'sho' | 'ten' | 'ketsu';
  label: string;
  description: string;
}

const nodeTypes: NodeTypeItem[] = [
  {
    type: 'storyNode',
    phase: 'ki',
    label: '起：序章',
    description: '物語の始まり・導入部',
  },
  {
    type: 'storyNode',
    phase: 'sho',
    label: '承：展開',
    description: '物語の展開・伏線',
  },
  {
    type: 'storyNode',
    phase: 'ten',
    label: '転：山場',
    description: '物語の転換点・クライマックス',
  },
  {
    type: 'storyNode',
    phase: 'ketsu',
    label: '結：結末',
    description: '物語の結末・まとめ',
  },
];

const StoryNodeMenu = () => {
  const onDragStart = (event: DragEvent<HTMLDivElement>, nodeType: string, phaseType: string) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/phase', phaseType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex flex-col gap-2">
      {nodeTypes.map((item) => (
        <div
          key={item.phase}
          draggable
          onDragStart={(event) => onDragStart(event, item.type, item.phase)}
          className={cn(
            "flex items-center gap-2 p-2 rounded-md cursor-grab border border-gray-200 bg-white hover:shadow-sm transition-all duration-200",
            item.phase === 'ki' && "border-l-4 border-l-storyflow-ki",
            item.phase === 'sho' && "border-l-4 border-l-storyflow-sho",
            item.phase === 'ten' && "border-l-4 border-l-storyflow-ten",
            item.phase === 'ketsu' && "border-l-4 border-l-storyflow-ketsu",
          )}
        >
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate">{item.label}</div>
            <div className="text-xs text-gray-500 truncate">{item.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoryNodeMenu;
