
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
import { BookText, Route, Layout, Film, UserCircle, Clock, ArrowRight, Info, FileText, Sparkles, Brush } from 'lucide-react';
import { toast } from 'sonner';

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
  const [activeTab, setActiveTab] = useState('info');
  
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
      
      // コンテンツがあるノードの場合、自動的にコンテンツタブを表示
      if ('content' in selectedNode.data && selectedNode.data.content) {
        setActiveTab('content');
      } else {
        setActiveTab('info');
      }
    } else {
      setTitle('');
      setDescription('');
      setContent('');
      setTags([]);
      setCharacters([]);
      setPhase('ki');
      setTimePosition(0);
      setActiveTab('info');
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
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm font-mincho">
        <p>ノードを選択してください</p>
      </div>
    );
  }
  
  const hasContent = selectedNode.data.content && String(selectedNode.data.content).trim().length > 0;
  
  return (
    <div className="h-full flex flex-col overflow-hidden japanese-card dark:bg-black/40">
      <div className="flex items-center p-4 pb-2 japanese-header">
        {getNodeIcon()}
        <h3 className="text-lg font-medium font-mincho">{getNodeTypeLabel()} の詳細</h3>
        {hasContent && (
          <div className="ml-auto flex items-center gap-1">
            <Brush className="h-4 w-4 text-japan-vermilion dark:text-japan-sakura" />
            <span className="text-xs text-japan-vermilion dark:text-japan-sakura font-gothic">執筆済み</span>
          </div>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="px-4 bg-transparent">
          <TabsTrigger value="info" className="flex items-center gap-1 font-gothic">
            <Info className="h-4 w-4" />
            基本情報
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-1 font-gothic">
            <FileText className="h-4 w-4" />
            コンテンツ
            {hasContent && <span className="ml-1 w-2 h-2 bg-japan-vermilion dark:bg-japan-sakura rounded-full"></span>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="flex-1 overflow-hidden px-4 pt-2 pb-4 mt-0">
          <ScrollArea className="h-full pr-2">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <Label htmlFor="node-title" className="font-mincho">タイトル</Label>
                <Input 
                  id="node-title" 
                  value={title} 
                  onChange={handleTitleChange}
                  className="mt-1 font-gothic"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <Label htmlFor="node-description" className="font-mincho">説明</Label>
              <Textarea 
                id="node-description" 
                value={description} 
                onChange={handleDescriptionChange}
                className="mt-1 resize-none h-24 font-gothic"
              />
            </div>
            
            {(selectedNode.data.type === 'scene') && (
              <div className="mb-4">
                <Label className="mb-1 block font-mincho">物語の局面</Label>
                <Select value={phase} onValueChange={handlePhaseChange}>
                  <SelectTrigger className="font-gothic">
                    <SelectValue placeholder="局面を選択..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ki" className="font-gothic">起 (導入)</SelectItem>
                    <SelectItem value="sho" className="font-gothic">承 (展開)</SelectItem>
                    <SelectItem value="ten" className="font-gothic">転 (転換)</SelectItem>
                    <SelectItem value="ketsu" className="font-gothic">結 (結末)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {(selectedNode.data.type === 'scene' || selectedNode.data.type === 'action') && (
              <div className="mb-4">
                <div className="flex items-center mb-1">
                  <Label htmlFor="time-position" className="flex items-center font-mincho">
                    <Clock className="h-4 w-4 mr-1" />
                    時系列位置
                  </Label>
                  <div className="ml-auto flex items-center">
                    <Info className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-gothic">時系列の順序を表します（並び替えには「タイムライン」のドラッグを使用）</span>
                  </div>
                </div>
                <div className="mt-2 px-1">
                  <Slider
                    id="time-position"
                    defaultValue={[timePosition]}
                    value={[timePosition]}
                    max={100}
                    step={1}
                    onValueChange={handleTimePositionChange}
                    className="dark:bg-black/20"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 font-gothic">
                    <span>早い</span>
                    <span>{timePosition}%</span>
                    <span>遅い</span>
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="content" className="flex-1 overflow-hidden px-4 pt-2 pb-4 mt-0">
          <ScrollArea className="h-full pr-2">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="node-content" className="flex items-center font-mincho">
                  <FileText className="h-4 w-4 mr-1" />
                  文章内容
                </Label>
                {hasContent && (
                  <span className="text-xs text-japan-vermilion dark:text-japan-sakura flex items-center font-gothic">
                    <Sparkles className="h-3 w-3 mr-1" />
                    執筆済み
                  </span>
                )}
              </div>
              <Textarea 
                id="node-content" 
                value={content} 
                onChange={handleContentChange}
                className="mt-1 resize-none h-[calc(100vh-220px)] min-h-[200px] font-gothic"
                placeholder="ここに文章を入力するか、「文章生成」ボタンを使ってAIに文章を生成してもらいましょう。"
              />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeDetailPanel;
