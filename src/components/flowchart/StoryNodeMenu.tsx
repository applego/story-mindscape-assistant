
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoryNodeMenuProps {
  onSelect: (phase: string) => void;
  onClose: () => void;
}

const nodeTypes = [
  {
    phase: 'ki',
    label: '起：序章',
    description: '物語の始まり・導入部',
  },
  {
    phase: 'sho',
    label: '承：展開',
    description: '物語の展開・伏線',
  },
  {
    phase: 'ten',
    label: '転：山場',
    description: '物語の転換点・クライマックス',
  },
  {
    phase: 'ketsu',
    label: '結：結末',
    description: '物語の結末・まとめ',
  },
];

const StoryNodeMenu = ({ onSelect, onClose }: StoryNodeMenuProps) => {
  return (
    <div className="flex flex-col gap-2 p-2 bg-white rounded-md shadow-md border">
      {nodeTypes.map((item) => (
        <Button
          key={item.phase}
          variant="ghost"
          className={cn(
            "flex items-start gap-2 p-2 justify-start h-auto",
            item.phase === 'ki' && "border-l-4 border-l-storyflow-ki",
            item.phase === 'sho' && "border-l-4 border-l-storyflow-sho",
            item.phase === 'ten' && "border-l-4 border-l-storyflow-ten",
            item.phase === 'ketsu' && "border-l-4 border-l-storyflow-ketsu",
          )}
          onClick={() => onSelect(item.phase.substring(0, 1))}
        >
          <div className="flex-1 min-w-0 text-left">
            <div className="font-medium text-sm truncate">{item.label}</div>
            <div className="text-xs text-gray-500 truncate">{item.description}</div>
          </div>
        </Button>
      ))}
      <Button variant="outline" size="sm" onClick={onClose}>
        閉じる
      </Button>
    </div>
  );
};

export default StoryNodeMenu;
