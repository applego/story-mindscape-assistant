import React, { useEffect, useState } from 'react';
import { Node } from '@xyflow/react';
import { StoryNodeData, StoryPhase } from './storyStructureTypes';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookText, Route, Layout, Film, UserCircle, Clock, ArrowRight } from 'lucide-react';

interface NodeDetailPanelProps {
  selectedNode: Node<StoryNodeData> | null;
  onNodeUpdate: (nodeId: string, newData: Partial<StoryNodeData>) => void;
}

const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ selectedNode, onNodeUpdate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [characters, setCharacters] = useState<string[]>([]);
  const [phase, setPhase] = useState<StoryPhase>('ki');
  const [timePosition, setTimePosition] = useState<number>(0);
  
  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title || '');
      setDescription(selectedNode.data.description || '');
      
      if ('content' in selectedNode.data && selectedNode.data.content) {
        setContent(String(selectedNode.data.content));
      } else {
        setContent('');
      }
      
      setTags(selectedNode.data.tags || []);
      setCharacters(selectedNode.data.characters || []);
      
      if ('phase' in selectedNode.data && selectedNode.data.phase) {
        setPhase(selectedNode.data.phase);
      } else {
        setPhase('ki');
      }
      
      if ((selectedNode.data.type === 'scene' || selectedNode.data.type === 'action') && 
          'timePosition' in selectedNode.data) {
        setTimePosition(selectedNode.data.timePosition !== undefined ? selectedNode.data.timePosition : 0);
      } else {
        setTimePosition(0);
      }
    } else {
      setTitle('');
      setDescription('');
      setContent('');
      setTags([]);
      setCharacters([]);
      setPhase('ki');
      setTimePosition(0);
    }
  }, [selectedNode]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { title: e.target.value });
    }
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { description: e.target.value });
    }
  };
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { content: e.target.value } as any);
    }
  };
  
  const handlePhaseChange = (value: string) => {
    const newPhase = value as StoryPhase;
    setPhase(newPhase);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { phase: newPhase } as any);
    }
  };
  
  const handleTimePositionChange = (value: number[]) => {
    const newValue = value[0];
    setTimePosition(newValue);
    if (selectedNode && (selectedNode.data.type === 'scene' || selectedNode.data.type === 'action')) {
      onNodeUpdate(selectedNode.id, { timePosition: newValue } as any);
    }
  };
  
  const getNodeIcon = () => {
    if (!selectedNode) return null;
    
    const type = selectedNode.data.type;
    
    switch (type) {
      case 'story': return <BookText className="h-5 w-5 mr-2" />;
      case 'storyline': return <Route className="h-5 w-5 mr-2" />;
      case 'sequence': return <Layout className="h-5 w-5 mr-2" />;
      case 'scene': return <Film className="h-5 w-5 mr-2" />;
      case 'action': 
        if ('actionType' in selectedNode.data && selectedNode.data.actionType === 'dialogue') {
          return <ArrowRight className="h-5 w-5 mr-2" />;
        }
        return <UserCircle className="h-5 w-5 mr-2" />;
      default: return null;
    }
  };
  
  const getNodeTypeLabel = () => {
    if (!selectedNode) return '';
    
    const type = selectedNode.data.type;
    
    switch (type) {
      case 'story': return 'ストーリー';
      case 'storyline': return 'ストーリーライン';
      case 'sequence': return 'シークエンス';
      case 'scene': return 'シーン';
      case 'action': 
        if ('actionType' in selectedNode.data) {
          if (selectedNode.data.actionType === 'dialogue') return '台詞';
          if (selectedNode.data.actionType === 'reaction') return 'リアクション';
          if (selectedNode.data.actionType === 'thought') return '思考';
        }
        return 'アクション';
      default: return '';
    }
  };
  
  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 text-sm">
        <p>ノードを選択してください</p>
      </div>
    );
  }
  
  return (
    <div className="h-full p-4">
      <div className="flex items-center mb-4">
        {getNodeIcon()}
        <h3 className="text-lg font-medium">{getNodeTypeLabel()} の詳細</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="node-title">タイトル</Label>
          <Input 
            id="node-title" 
            value={title} 
            onChange={handleTitleChange}
            className="mt-1"
          />
        </div>
        
        {(selectedNode.data.type === 'scene' || selectedNode.data.type === 'action') && (
          <div>
            <Label className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              時系列位置
            </Label>
            <div className="mt-2 px-1">
              <Slider
                defaultValue={[timePosition]}
                value={[timePosition]}
                max={100}
                step={1}
                onValueChange={handleTimePositionChange}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>早い</span>
                <span>{timePosition}%</span>
                <span>遅い</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <Label htmlFor="node-description">説明</Label>
        <Textarea 
          id="node-description" 
          value={description} 
          onChange={handleDescriptionChange}
          className="mt-1 resize-none h-20"
        />
      </div>
      
      {(selectedNode.data.type === 'scene' || selectedNode.data.type === 'action') && (
        <div className="mb-4">
          <Label htmlFor="node-content">内容</Label>
          <Textarea 
            id="node-content" 
            value={content} 
            onChange={handleContentChange}
            className="mt-1 resize-none h-24"
          />
        </div>
      )}
      
      {(selectedNode.data.type === 'scene') && (
        <div className="mb-4">
          <Label className="mb-1 block">物語の局面</Label>
          <Select value={phase} onValueChange={handlePhaseChange}>
            <SelectTrigger>
              <SelectValue placeholder="局面を選択..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ki">起 (導入)</SelectItem>
              <SelectItem value="sho">承 (展開)</SelectItem>
              <SelectItem value="ten">転 (転換)</SelectItem>
              <SelectItem value="ketsu">結 (結末)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default NodeDetailPanel;
