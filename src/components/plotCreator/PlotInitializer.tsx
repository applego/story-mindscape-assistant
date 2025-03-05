
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { plotTemplates } from '@/data/plotStructureTemplates';
import { Node } from '@xyflow/react';
import { StoryNodeData } from '../flowchart/storyStructureTypes';
import { Sparkles, Rocket, Lightbulb } from 'lucide-react';

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
  const [animateIn, setAnimateIn] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trigger animations when modal opens
  useEffect(() => {
    if (isOpen) {
      setAnimateIn(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    // Add transition animation between steps
    if (dialogRef.current) {
      dialogRef.current.classList.add('animate-pulse-slow');
      setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.classList.remove('animate-pulse-slow');
        }
        if (currentStep < 3) {
          setCurrentStep(currentStep + 1);
        } else {
          generatePlot();
        }
      }, 300);
    } else {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        generatePlot();
      }
    }
  };

  const handleBack = () => {
    // Add transition animation for going back
    if (dialogRef.current) {
      dialogRef.current.classList.add('animate-pulse-slow');
      setTimeout(() => {
        if (dialogRef.current) {
          dialogRef.current.classList.remove('animate-pulse-slow');
        }
        if (currentStep > 1) {
          setCurrentStep(currentStep - 1);
        }
      }, 300);
    } else {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
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

    // Add closing animation before closing
    if (dialogRef.current) {
      dialogRef.current.classList.add('animate-fade-out');
      setTimeout(() => {
        // Pass the new nodes to the parent component
        onCreatePlot(newNodes);
        onClose();
      }, 500);
    } else {
      onCreatePlot(newNodes);
      onClose();
    }
  };

  // Get step icon
  const getStepIcon = () => {
    switch (currentStep) {
      case 1: 
        return <Lightbulb className="h-10 w-10 text-yellow-500 animate-pulse" />;
      case 2: 
        return <Rocket className="h-10 w-10 text-blue-500 animate-float" />;
      case 3: 
        return <Sparkles className="h-10 w-10 text-purple-500 animate-pulse-slow" />;
      default: 
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center">
      <div 
        ref={dialogRef}
        className={`relative ${animateIn ? 'animate-slide-in' : ''}`}
      >
        {/* Floating particles effect around the card */}
        <div className="absolute -inset-10 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-primary/20 w-2 h-2"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 7}s`
              }}
            />
          ))}
        </div>

        <Card className="w-[700px] max-w-[95vw] overflow-hidden border-2 border-primary/20 shadow-xl shadow-primary/10">
          {/* Animated gradient header */}
          <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxsaW5lIHgxPSIwIiB5PSIwIiB4Mj0iMTAiIHkyPSIwIiBzdHJva2U9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI3BhdHRlcm4pIi8+PC9zdmc+')] opacity-25"></div>
            <div className="absolute top-1/2 left-6 transform -translate-y-1/2 flex items-center gap-4">
              {getStepIcon()}
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {currentStep === 1 ? 'ストーリーの種を植える' : 
                  currentStep === 2 ? 'ストーリーの骨組みを選ぶ' : 
                  'ストーリーの誕生'}
                </h2>
                <p className="text-white/80 text-sm">
                  {currentStep === 1 ? 'アイデアを言葉にしましょう' : 
                  currentStep === 2 ? '物語の構造を決めましょう' : 
                  '創作の旅を始めましょう'}
                </p>
              </div>
            </div>
            
            {/* Step indicator */}
            <div className="absolute bottom-2 right-6 flex gap-2">
              {[1, 2, 3].map(step => (
                <div 
                  key={step} 
                  className={`w-2 h-2 rounded-full ${
                    currentStep === step 
                      ? 'bg-white animate-pulse' 
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
          
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-lg font-medium flex items-center">
                    <span className="relative">
                      ストーリータイトル
                      <span className="absolute -top-1 -right-6">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                      </span>
                    </span>
                  </Label>
                  <Input 
                    id="title" 
                    placeholder="タイトルを入力してください" 
                    value={storyTitle}
                    onChange={(e) => setStoryTitle(e.target.value)}
                    className="text-lg py-6 border-primary/20 focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="premise" className="text-lg font-medium">ストーリーの前提/設定</Label>
                  <Textarea 
                    id="premise" 
                    placeholder="ストーリーの基本設定や前提を入力してください" 
                    className="min-h-[150px] text-base border-primary/20 focus:border-primary/50 transition-all"
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
                className="space-y-6 animate-fade-in"
              >
                {plotTemplates.map(template => (
                  <div 
                    key={template.id} 
                    className={`flex items-start space-x-3 p-4 rounded-lg transition-all border-2 ${
                      selectedTemplateId === template.id 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-muted hover:border-primary/30 hover:bg-muted/30'
                    }`}
                  >
                    <RadioGroupItem 
                      value={template.id} 
                      id={template.id} 
                      className="mt-1" 
                    />
                    <div className="grid gap-2 leading-none w-full">
                      <Label 
                        htmlFor={template.id} 
                        className={`text-lg font-medium mb-1 ${
                          selectedTemplateId === template.id ? 'text-primary' : ''
                        }`}
                      >
                        {template.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {template.nodes.map((node, idx) => (
                          <span 
                            key={idx} 
                            className={`text-xs px-3 py-1.5 rounded-full transition-transform hover:scale-105 ${
                              node.phase === 'ki' ? 'bg-blue-100 text-blue-800' :
                              node.phase === 'sho' ? 'bg-green-100 text-green-800' :
                              node.phase === 'ten' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            } ${selectedTemplateId === template.id ? 'animate-float' : ''}`}
                            style={{ 
                              animationDelay: `${idx * 0.1}s`,
                              animationDuration: '3s'
                            }}
                          >
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
              <div className="space-y-6 animate-fade-in">
                <div className="rounded-lg border-2 border-primary/20 p-6 bg-gradient-to-br from-primary/5 to-transparent">
                  <h3 className="text-xl font-medium text-primary mb-4">ストーリー概要</h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">タイトル</p>
                      <p className="text-lg font-medium">{storyTitle}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-muted-foreground">前提/設定</p>
                      <p className="text-base">{storyPremise}</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border-2 border-primary/20 p-6 bg-gradient-to-br from-primary/5 to-transparent">
                  <h3 className="text-xl font-medium text-primary mb-4">選択したプロット構造</h3>
                  {selectedTemplateId ? (
                    <div className="space-y-4">
                      <p className="text-lg font-medium">
                        {plotTemplates.find(t => t.id === selectedTemplateId)?.name}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                        {plotTemplates.find(t => t.id === selectedTemplateId)?.nodes.map((node, idx) => (
                          <div 
                            key={idx} 
                            className={`flex items-center gap-3 p-3 rounded-lg border animate-float ${
                              node.phase === 'ki' ? 'border-blue-200 bg-blue-50' :
                              node.phase === 'sho' ? 'border-green-200 bg-green-50' :
                              node.phase === 'ten' ? 'border-amber-200 bg-amber-50' :
                              'border-red-200 bg-red-50'
                            }`}
                            style={{ animationDelay: `${idx * 0.15}s` }}
                          >
                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-white text-xs font-bold ${
                              node.phase === 'ki' ? 'bg-blue-500' :
                              node.phase === 'sho' ? 'bg-green-500' :
                              node.phase === 'ten' ? 'bg-amber-500' :
                              'bg-red-500'
                            }`}>
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-sm font-medium">{node.label}</span>
                              <p className="text-xs text-muted-foreground">{node.description}</p>
                            </div>
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
          
          <CardFooter className="flex justify-between p-6 bg-muted/30 border-t">
            {currentStep > 1 ? (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">戻る</span>
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={onClose}
                className="relative overflow-hidden group"
              >
                <span className="relative z-10">キャンセル</span>
              </Button>
            )}
            
            <Button 
              onClick={handleNext}
              disabled={(currentStep === 1 && !storyTitle) || (currentStep === 2 && !selectedTemplateId)}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center gap-2">
                {currentStep < 3 ? '次へ' : 'プロットを作成'}
                {currentStep < 3 && (
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                )}
                {currentStep === 3 && (
                  <Sparkles className="h-4 w-4 animate-pulse" />
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PlotInitializer;
