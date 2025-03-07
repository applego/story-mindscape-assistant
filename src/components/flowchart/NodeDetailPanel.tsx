
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
import { BookText, Route, Layout, Film, UserCircle, Clock, ArrowRight, Info, FileText, Sparkles, Brush, Eye } from 'lucide-react';
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
  
  // 読者がページをめくる理由のフック
  const [futureHook, setFutureHook] = useState('');
  const [pastHook, setPastHook] = useState('');
  const [presentHook, setPresentHook] = useState('');
  
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
      
      // 読者フックのデータをロード
      setFutureHook(selectedNode.data.futureHook || '');
      setPastHook(selectedNode.data.pastHook || '');
      setPresentHook(selectedNode.data.presentHook || '');
      
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
      setFutureHook('');
      setPastHook('');
      setPresentHook('');
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
  
  // 読者フックのハンドラー
  const handleFutureHookChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFutureHook(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { futureHook: e.target.value });
    }
  };
  
  const handlePastHookChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPastHook(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { pastHook: e.target.value });
    }
  };
  
  const handlePresentHookChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPresentHook(e.target.value);
    if (selectedNode) {
      onNodeUpdate(selectedNode.id, { presentHook: e.target.value });
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
          <TabsTrigger value="hooks" className="flex items-center gap-1 font-gothic">
            <Eye className="h-4 w-4" />
            読者フック
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
        
        <TabsContent value="hooks" className="flex-1 overflow-hidden px-4 pt-2 pb-4 mt-0">
          <ScrollArea className="h-full pr-2">
            <div className="mb-4">
              <Label htmlFor="future-hook" className="flex items-center font-mincho mb-1">
                <span className="text-blue-600 dark:text-blue-400 font-bold mr-1">1.</span>
                未来が気になる
              </Label>
              <Textarea 
                id="future-hook" 
                value={futureHook} 
                onChange={handleFutureHookChange}
                className="mt-1 resize-none h-20 font-gothic"
                placeholder="このシーン/キャラクターの次に何が起こるのか気になるポイントは？"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="past-hook" className="flex items-center font-mincho mb-1">
                <span className="text-green-600 dark:text-green-400 font-bold mr-1">2.</span>
                過去が気になる
              </Label>
              <Textarea 
                id="past-hook" 
                value={pastHook} 
                onChange={handlePastHookChange}
                className="mt-1 resize-none h-20 font-gothic"
                placeholder="このシーン/キャラクターの背景や過去について気になる点は？"
              />
            </div>
            
            <div className="mb-4">
              <Label htmlFor="present-hook" className="flex items-center font-mincho mb-1">
                <span className="text-yellow-600 dark:text-yellow-400 font-bold mr-1">3.</span>
                現在起きていることが気になる
              </Label>
              <Textarea 
                id="present-hook" 
                onChange={handlePresentHookChange}
                value={presentHook} 
                className="mt-1 resize-none h-20 font-gothic"
                placeholder="今まさに起きている状況で読者が気になるポイントは？"
              />
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <h4 className="font-mincho text-sm mb-2">読者がページをめくる理由</h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 font-gothic mb-2">
                読者がストーリーに引き込まれる理由を3つの時間軸で考えると効果的です。
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1 font-gothic">
                <li className="flex">
                  <span className="text-blue-600 dark:text-blue-400 font-bold mr-1">1.</span>
                  <span>未来が気になる - 「次に何が起こるのか」が気になり、先を読みたくなる</span>
                </li>
                <li className="flex">
                  <span className="text-green-600 dark:text-green-400 font-bold mr-1">2.</span>
                  <span>過去が気になる - 「なぜこうなったのか」背景や伏線が気になる</span>
                </li>
                <li className="flex">
                  <span className="text-yellow-600 dark:text-yellow-400 font-bold mr-1">3.</span>
                  <span>現在が気になる - 「今まさに」起きていることの行方が気になる</span>
                </li>
              </ul>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NodeDetailPanel;
