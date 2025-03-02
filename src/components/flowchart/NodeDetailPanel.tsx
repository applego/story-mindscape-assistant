
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { StoryNodeData } from './nodes/StoryNode';

interface NodeDetailPanelProps {
  selectedNode: Node<StoryNodeData> | null;
  onNodeUpdate: (id: string, data: Partial<StoryNodeData>) => void;
}

const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ selectedNode, onNodeUpdate }) => {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');

  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title || selectedNode.data.label || '');
      setContent(selectedNode.data.content || selectedNode.data.description || '');
      setTags(selectedNode.data.tags || []);
    }
  }, [selectedNode]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { 
        title: e.target.value,
        label: e.target.value // Update label as well to maintain compatibility
      });
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { 
        content: e.target.value,
        description: e.target.value // Update description as well to maintain compatibility
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setTagInput('');
      if (selectedNode) {
        onNodeUpdate(selectedNode.id, { tags: newTags });
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { tags: newTags });
    }
  };

  if (!selectedNode) {
    return (
      <Card className="w-full h-full">
        <CardContent className="p-4 flex items-center justify-center h-full">
          <p className="text-gray-500">ノードを選択してください</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="node-title">タイトル</Label>
            <Input 
              id="node-title" 
              value={title} 
              onChange={handleTitleChange} 
              placeholder="ノードのタイトルを入力" 
            />
          </div>
          
          <div>
            <Label htmlFor="node-content">内容</Label>
            <Textarea 
              id="node-content" 
              value={content} 
              onChange={handleContentChange} 
              placeholder="ノードの内容を入力"
              className="min-h-[150px]"
            />
          </div>
          
          <div>
            <Label htmlFor="node-tags">タグ</Label>
            <div className="flex gap-2">
              <Input 
                id="node-tags" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                placeholder="タグを追加" 
              />
              <Button type="button" onClick={handleAddTag} size="sm">追加</Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag) => (
                  <div 
                    key={tag} 
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)} 
                      className="text-secondary-foreground/70 hover:text-secondary-foreground"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NodeDetailPanel;
