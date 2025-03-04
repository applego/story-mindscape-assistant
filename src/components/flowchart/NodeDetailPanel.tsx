import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { StoryNodeData, SceneData, ActionData } from './storyStructureTypes';
import { 
  BookText, 
  Route, 
  Layout, 
  Film, 
  MessageCircle, 
  UserCircle,
  PenTool,
  Clock
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface NodeDetailPanelProps {
  selectedNode: Node<StoryNodeData> | null;
  onNodeUpdate: (id: string, data: Partial<StoryNodeData>) => void;
}

const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({ selectedNode, onNodeUpdate }) => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [characters, setCharacters] = useState<string[]>([]);
  const [characterInput, setCharacterInput] = useState<string>('');
  const [phase, setPhase] = useState<string>('ki');
  const [actionType, setActionType] = useState<string>('action');
  const [character, setCharacter] = useState<string>('');
  const [timePosition, setTimePosition] = useState<number>(0);

  useEffect(() => {
    if (selectedNode) {
      setTitle(selectedNode.data.title || '');
      setDescription(selectedNode.data.description || '');
      
      // Check if content exists in the node data based on type
      if ('content' in selectedNode.data) {
        setContent(selectedNode.data.content || '');
      } else {
        setContent('');
      }
      
      setTags(selectedNode.data.tags || []);
      setCharacters(selectedNode.data.characters || []);
      setPhase(selectedNode.data.phase || 'ki');
      
      // 時系列位置の設定
      if ((selectedNode.data.type === 'scene' || selectedNode.data.type === 'action') && 
          'timePosition' in selectedNode.data) {
        setTimePosition(selectedNode.data.timePosition || 0);
      } else {
        setTimePosition(0);
      }
      
      if (selectedNode.data.type === 'action' && 'actionType' in selectedNode.data) {
        setActionType(selectedNode.data.actionType || 'action');
        setCharacter(selectedNode.data.character || '');
      }
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
      onNodeUpdate(selectedNode.id, { content: e.target.value });
    }
  };

  const handleTimePositionChange = (value: number[]) => {
    const position = value[0];
    setTimePosition(position);
    if (selectedNode && (selectedNode.data.type === 'scene' || selectedNode.data.type === 'action')) {
      onNodeUpdate(selectedNode.id, { timePosition: position });
    }
  };

  const handlePhaseChange = (value: string) => {
    setPhase(value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { phase: value as any });
    }
  };

  const handleActionTypeChange = (value: string) => {
    setActionType(value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { actionType: value as any });
    }
  };

  const handleCharacterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacter(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { character: e.target.value });
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

  const handleAddCharacter = () => {
    if (characterInput.trim() && !characters.includes(characterInput.trim())) {
      const newCharacters = [...characters, characterInput.trim()];
      setCharacters(newCharacters);
      setCharacterInput('');
      if (selectedNode) {
        onNodeUpdate(selectedNode.id, { characters: newCharacters });
      }
    }
  };

  const handleRemoveCharacter = (characterToRemove: string) => {
    const newCharacters = characters.filter(char => char !== characterToRemove);
    setCharacters(newCharacters);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { characters: newCharacters });
    }
  };

  if (!selectedNode) {
    return (
      <Card className="w-full h-full">
        <CardContent className="p-6 flex items-center justify-center h-full">
          <p className="text-gray-500">ノードを選択してください</p>
        </CardContent>
      </Card>
    );
  }

  const getNodeTypeIcon = () => {
    switch (selectedNode.data.type) {
      case 'story': return <BookText className="h-5 w-5 mr-2" />;
      case 'storyline': return <Route className="h-5 w-5 mr-2" />;
      case 'sequence': return <Layout className="h-5 w-5 mr-2" />;
      case 'scene': return <Film className="h-5 w-5 mr-2" />;
      case 'action': 
        if (selectedNode.data.actionType === 'dialogue') return <MessageCircle className="h-5 w-5 mr-2" />;
        if (selectedNode.data.actionType === 'thought') return <PenTool className="h-5 w-5 mr-2" />;
        return <UserCircle className="h-5 w-5 mr-2" />;
      default: return null;
    }
  };

  const getNodeTypeName = () => {
    switch (selectedNode.data.type) {
      case 'story': return '物語';
      case 'storyline': return 'ストーリーライン';
      case 'sequence': return 'シークエンス';
      case 'scene': return 'シーン';
      case 'action': 
        if (selectedNode.data.actionType === 'dialogue') return '台詞';
        if (selectedNode.data.actionType === 'reaction') return 'リアクション';
        if (selectedNode.data.actionType === 'thought') return '思考';
        return 'アクション';
      default: return 'ノード';
    }
  };

  return (
    <Card className="w-full h-full overflow-auto">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          {getNodeTypeIcon()}
          <h3 className="text-lg font-medium">{getNodeTypeName()}の詳細</h3>
        </div>
        
        <div className="space-y-5">
          <div>
            <Label htmlFor="node-title">タイトル</Label>
            <Input 
              id="node-title" 
              value={title} 
              onChange={handleTitleChange} 
              placeholder="タイトルを入力" 
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="node-description">説明</Label>
            <Textarea 
              id="node-description" 
              value={description} 
              onChange={handleDescriptionChange} 
              placeholder="説明を入力"
              className="min-h-[80px] mt-1"
            />
          </div>
          
          {(selectedNode.data.type === 'scene' || selectedNode.data.type === 'action') && 'content' in selectedNode.data && (
            <div>
              <Label htmlFor="node-content">内容</Label>
              <Textarea 
                id="node-content" 
                value={content} 
                onChange={handleContentChange} 
                placeholder="内容を入力"
                className="min-h-[120px] mt-1"
              />
            </div>
          )}
          
          {/* 時系列位置の設定 - シーンとアクションの場合のみ表示 */}
          {(selectedNode.data.type === 'scene' || selectedNode.data.type === 'action') && (
            <div>
              <Label htmlFor="time-position" className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                時系列上の位置
              </Label>
              <div className="mt-2 px-2">
                <Slider
                  id="time-position"
                  value={[timePosition]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleTimePositionChange}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>開始</span>
                <span>{timePosition}%</span>
                <span>終了</span>
              </div>
            </div>
          )}
          
          {selectedNode.data.type === 'action' && 'actionType' in selectedNode.data && (
            <>
              <div>
                <Label htmlFor="action-type">アクションタイプ</Label>
                <Select value={actionType} onValueChange={handleActionTypeChange}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="アクションタイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="action">アクション</SelectItem>
                    <SelectItem value="reaction">リアクション</SelectItem>
                    <SelectItem value="dialogue">台詞</SelectItem>
                    <SelectItem value="thought">思考</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="character">キャラクター</Label>
                <Input 
                  id="character" 
                  value={character} 
                  onChange={handleCharacterChange} 
                  placeholder="行動するキャラクター" 
                  className="mt-1"
                />
              </div>
            </>
          )}
          
          {selectedNode.data.type === 'scene' && (
            <div>
              <Label htmlFor="scene-phase">段階</Label>
              <Select value={phase} onValueChange={handlePhaseChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="段階を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ki">起</SelectItem>
                  <SelectItem value="sho">承</SelectItem>
                  <SelectItem value="ten">転</SelectItem>
                  <SelectItem value="ketsu">結</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {(selectedNode.data.type === 'scene' || selectedNode.data.type === 'storyline' || selectedNode.data.type === 'sequence') && (
            <div>
              <Label htmlFor="node-characters">登場キャラクター</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  id="node-characters" 
                  value={characterInput} 
                  onChange={(e) => setCharacterInput(e.target.value)} 
                  placeholder="キャラクターを追加" 
                />
                <Button type="button" onClick={handleAddCharacter} size="sm">追加</Button>
              </div>
              
              {characters.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {characters.map((char) => (
                    <div 
                      key={char} 
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1"
                    >
                      <UserCircle size={12} />
                      {char}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveCharacter(char)} 
                        className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          <div>
            <Label htmlFor="node-tags">タグ</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="node-tags" 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                placeholder="タグを追加" 
              />
              <Button type="button" onClick={handleAddTag} size="sm">追加</Button>
            </div>
            
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {tags.map((tag) => (
                  <div 
                    key={tag} 
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)} 
                      className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
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
