
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Node } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';
import { Sparkles, Check, AlertCircle } from 'lucide-react';

interface StoryGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodesToGenerate: Node<StoryNodeData>[];
  onGenerationComplete: (generatedNodes: { id: string; content: string }[]) => void;
  generationProgress: number;
  isGenerating: boolean;
  generatedResults: { id: string; content: string }[];
}

const StoryGenerationModal: React.FC<StoryGenerationModalProps> = ({
  isOpen,
  onClose,
  nodesToGenerate,
  onGenerationComplete,
  generationProgress,
  isGenerating,
  generatedResults,
}) => {
  const [expandedNode, setExpandedNode] = useState<string | null>(null);

  // 生成が完了したらダイアログを自動的に閉じない
  useEffect(() => {
    if (generationProgress === 100 && isGenerating) {
      // 生成完了時の処理
    }
  }, [generationProgress, isGenerating]);

  const handleConfirm = () => {
    onGenerationComplete(generatedResults);
    onClose();
  };

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'story': return 'ストーリー';
      case 'storyline': return 'ストーリーライン';
      case 'sequence': return 'シークエンス';
      case 'scene': return 'シーン';
      case 'action': 
        return 'アクション';
      default: return 'ノード';
    }
  };

  const toggleExpand = (nodeId: string) => {
    if (expandedNode === nodeId) {
      setExpandedNode(null);
    } else {
      setExpandedNode(nodeId);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" />
            ストーリー文章生成
          </DialogTitle>
          <DialogDescription>
            選択したノードとその子ノードの文章を生成しています。
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden py-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                {isGenerating ? '生成中...' : '生成完了'}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.min(generationProgress, 100)}%
              </span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>

          <ScrollArea className="h-[40vh] rounded-md border p-4">
            <div className="space-y-4">
              {nodesToGenerate.map((node) => {
                const isGenerated = generatedResults.some(r => r.id === node.id);
                const result = generatedResults.find(r => r.id === node.id);
                const isExpanded = expandedNode === node.id;

                return (
                  <div 
                    key={node.id} 
                    className={`p-4 rounded-lg border ${
                      isGenerated 
                        ? 'border-green-200 bg-green-50' 
                        : isGenerating 
                          ? 'border-yellow-200 bg-yellow-50 animate-pulse' 
                          : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(node.id)}
                    >
                      <div className="flex items-center">
                        {isGenerated ? (
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300 mr-2"></div>
                        )}
                        <div>
                          <span className="text-xs text-gray-500">
                            {getNodeTypeLabel(node.data.type)}
                          </span>
                          <h4 className="font-medium">{node.data.title}</h4>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(node.id);
                        }}
                      >
                        {isExpanded ? '折りたたむ' : '表示'}
                      </Button>
                    </div>

                    {isExpanded && result && (
                      <div className="mt-4 pl-7">
                        <div className="text-sm bg-white p-3 rounded border whitespace-pre-wrap">
                          {result.content}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          {generationProgress === 100 ? (
            <Button onClick={handleConfirm}>
              確定して反映する
            </Button>
          ) : (
            <Button disabled>
              生成中...
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StoryGenerationModal;
