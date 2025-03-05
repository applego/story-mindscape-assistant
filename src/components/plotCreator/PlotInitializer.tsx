
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { plotTemplates, PlotTemplate } from '@/data/plotStructureTemplates';
import { Node } from '@xyflow/react';
import { StoryNodeData } from '../flowchart/storyStructureTypes';

interface PlotInitializerProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlot: (nodes: Node<StoryNodeData>[]) => void;
}

export const PlotInitializer = ({ isOpen, onClose, onCreatePlot }: PlotInitializerProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [storyTitle, setStoryTitle] = useState('');
  const [storyPremise, setStoryPremise] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      generatePlot();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generatePlot = () => {
    // Find the selected template
    const selectedTemplate = plotTemplates.find(t => t.id === selectedTemplateId);
    
    if (!selectedTemplate) {
      alert('テンプレートを選択してください');
      return;
    }

    // Convert template nodes to React Flow nodes
    const newNodes: Node<StoryNodeData>[] = selectedTemplate.nodes.map((node, index) => {
      // Calculate position based on timePosition
      const xPosition = 100 + (node.timePosition * 8);
      const yPosition = 100 + (index % 2 === 0 ? 0 : 150);

      return {
        id: node.id,
        type: 'storyNode',
        position: { x: xPosition, y: yPosition },
        data: {
          id: node.id,
          type: node.type as any,
          label: node.label,
          description: node.description,
          phase: node.phase,
          content: '',
          title: `${node.label} - ${storyTitle}`,
          characters: [],
          tags: [],
          notes: storyPremise,
          timePosition: node.timePosition
        } as StoryNodeData
      };
    });

    // Pass the new nodes to the parent component
    onCreatePlot(newNodes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <Card className="w-[600px] max-w-[90vw]">
        <CardHeader>
          <CardTitle>
            {currentStep === 1 ? 'ストーリーの基本情報' : 
             currentStep === 2 ? 'プロットテンプレートの選択' : 
             'ストーリー内容の確認'}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 ? 'ストーリーのタイトルと基本設定を入力してください' : 
             currentStep === 2 ? '使用したいプロット構造テンプレートを選択してください' : 
             '内容を確認して、プロットを作成しましょう'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">ストーリータイトル</Label>
                <Input 
                  id="title" 
                  placeholder="タイトルを入力してください" 
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premise">ストーリーの前提/設定</Label>
                <Textarea 
                  id="premise" 
                  placeholder="ストーリーの基本設定や前提を入力してください" 
                  className="min-h-[100px]"
                  value={storyPremise}
                  onChange={(e) => setStoryPremise(e.target.value)}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <RadioGroup 
              value={selectedTemplateId} 
              onValueChange={setSelectedTemplateId}
              className="space-y-4"
            >
              {plotTemplates.map(template => (
                <div key={template.id} className="flex items-start space-x-2">
                  <RadioGroupItem value={template.id} id={template.id} className="mt-1" />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor={template.id} className="text-base font-medium mb-1">
                      {template.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {template.nodes.map((node, idx) => (
                        <span key={idx} className={`text-xs px-2 py-1 rounded-full ${
                          node.phase === 'ki' ? 'bg-blue-100 text-blue-800' :
                          node.phase === 'sho' ? 'bg-green-100 text-green-800' :
                          node.phase === 'ten' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {node.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">ストーリー概要</h3>
                <p className="text-sm font-medium mt-2">タイトル: {storyTitle}</p>
                <p className="text-sm mt-1">前提/設定: {storyPremise}</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-lg font-medium">プロット構造</h3>
                {selectedTemplateId ? (
                  <div className="mt-2">
                    <p className="text-sm font-medium">
                      {plotTemplates.find(t => t.id === selectedTemplateId)?.name}
                    </p>
                    <div className="mt-2 space-y-2">
                      {plotTemplates.find(t => t.id === selectedTemplateId)?.nodes.map((node, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${
                            node.phase === 'ki' ? 'bg-blue-500' :
                            node.phase === 'sho' ? 'bg-green-500' :
                            node.phase === 'ten' ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}></span>
                          <span className="text-sm">{node.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">テンプレートが選択されていません</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handleBack}>戻る</Button>
          ) : (
            <Button variant="outline" onClick={onClose}>キャンセル</Button>
          )}
          
          <Button 
            onClick={handleNext}
            disabled={(currentStep === 1 && !storyTitle) || (currentStep === 2 && !selectedTemplateId)}
          >
            {currentStep < 3 ? '次へ' : 'プロットを作成'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlotInitializer;
