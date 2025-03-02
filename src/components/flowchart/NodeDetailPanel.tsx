
import { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, UserCircle, Trash2 } from 'lucide-react';

interface NodeDetailPanelProps {
  selectedNode: Node | null;
  onNodeUpdate: (nodeId: string, data: any) => void;
}

const NodeDetailPanel = ({ selectedNode, onNodeUpdate }: NodeDetailPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [nodeTitle, setNodeTitle] = useState('');
  const [nodeDescription, setNodeDescription] = useState('');
  const [characterList, setCharacterList] = useState<string[]>([]);
  const [newCharacter, setNewCharacter] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setNodeTitle(selectedNode.data.label || '');
      setNodeDescription(selectedNode.data.description || '');
      setCharacterList(selectedNode.data.characters || []);
    }
  }, [selectedNode]);

  if (!selectedNode) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setNodeTitle(newTitle);
    onNodeUpdate(selectedNode.id, { ...selectedNode.data, label: newTitle });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setNodeDescription(newDescription);
    onNodeUpdate(selectedNode.id, { ...selectedNode.data, description: newDescription });
  };

  const addCharacter = () => {
    if (!newCharacter.trim()) return;
    
    const updatedCharacters = [...characterList, newCharacter];
    setCharacterList(updatedCharacters);
    setNewCharacter('');
    onNodeUpdate(selectedNode.id, { ...selectedNode.data, characters: updatedCharacters });
  };

  const removeCharacter = (index: number) => {
    const updatedCharacters = characterList.filter((_, i) => i !== index);
    setCharacterList(updatedCharacters);
    onNodeUpdate(selectedNode.id, { ...selectedNode.data, characters: updatedCharacters });
  };

  const getPhaseLabel = () => {
    switch (selectedNode.data.phase) {
      case 'ki': return '起：序章';
      case 'sho': return '承：展開';
      case 'ten': return '転：山場';
      case 'ketsu': return '結：結末';
      default: return 'シーン';
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t shadow-md transition-all duration-300 z-10"
      style={{ height: isExpanded ? '40%' : '42px' }}
    >
      <div className="flex items-center justify-between p-2 border-b">
        <div className="font-medium flex items-center">
          <span className="mr-2">{getPhaseLabel()}</span>
          <span className="text-gray-500">{selectedNode.id}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4 overflow-auto h-[calc(100%-42px)]">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="node-title">シーンタイトル</Label>
              <Input
                id="node-title"
                value={nodeTitle}
                onChange={handleTitleChange}
                placeholder="シーンのタイトル"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="node-description">シーン説明</Label>
              <Textarea
                id="node-description"
                value={nodeDescription}
                onChange={handleDescriptionChange}
                placeholder="このシーンで何が起こるか、どのような感情を表現したいかなど..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label className="mb-2 block">登場キャラクター</Label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {characterList.map((char, index) => (
                  <div key={index} className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                    <UserCircle size={16} className="mr-1 text-gray-500" />
                    <span className="text-sm">{char}</span>
                    <Button variant="ghost" size="sm" className="ml-1 h-6 w-6 p-0" onClick={() => removeCharacter(index)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input 
                  value={newCharacter}
                  onChange={(e) => setNewCharacter(e.target.value)}
                  placeholder="キャラクター名を入力"
                  onKeyDown={(e) => e.key === 'Enter' && addCharacter()}
                />
                <Button onClick={addCharacter}>追加</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDetailPanel;
