
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, MessageSquare, GitBranch } from "lucide-react";

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show the modal on first load
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-storyflow-ki via-storyflow-sho to-storyflow-ketsu relative">
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/40 to-transparent text-white">
            <h2 className="text-2xl font-bold">StoryMindscape</h2>
            <p className="text-sm opacity-90">シナリオセンター式の物語作成アシスタント</p>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="p-6">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="overview" className="flex-1">概要</TabsTrigger>
            <TabsTrigger value="features" className="flex-1">機能</TabsTrigger>
            <TabsTrigger value="tutorial" className="flex-1">使い方</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-0">
            <div className="space-y-4">
              <p>
                StoryMindscapeへようこそ！このアプリケーションは、シナリオセンター式の手法に基づいた物語作成を支援するために設計されています。
              </p>
              <p>
                マインドマップのような直感的なインターフェースで、ストーリーの構造を視覚化しながら執筆することができます。AIアシスタントがあなたの創作をサポートします。
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <BookOpen className="text-storyflow-ki shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm">直感的なストーリー構築</h3>
                    <p className="text-xs text-gray-500">起承転結を視覚的に配置</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <MessageSquare className="text-storyflow-sho shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm">AIアシスタント</h3>
                    <p className="text-xs text-gray-500">ストーリー構成のアドバイス</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <Users className="text-storyflow-ten shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm">キャラクター設計</h3>
                    <p className="text-xs text-gray-500">魅力的な登場人物を作成</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                  <GitBranch className="text-storyflow-ketsu shrink-0" />
                  <div>
                    <h3 className="font-medium text-sm">柔軟なプロット編集</h3>
                    <p className="text-xs text-gray-500">自由に構成を変更可能</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="mt-0">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-storyflow-ki text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">起</div>
                <div>
                  <h3 className="font-medium">ストーリーマッピング</h3>
                  <p className="text-sm text-gray-600">ドラッグ＆ドロップで簡単にストーリーの流れを構築できます。起承転結のノードを配置し、物語の構造を可視化します。</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-storyflow-sho text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">承</div>
                <div>
                  <h3 className="font-medium">AIアシスタント</h3>
                  <p className="text-sm text-gray-600">チャットパネルでAIアシスタントに質問したり、アドバイスを求めたりできます。シナリオセンター式の手法に基づいたフィードバックが得られます。</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-storyflow-ten text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">転</div>
                <div>
                  <h3 className="font-medium">キャラクター管理</h3>
                  <p className="text-sm text-gray-600">登場人物の設定を管理し、キャラクターの動機や目標、成長を追跡できます。各キャラクターの二面性や葛藤を設計できます。</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-storyflow-ketsu text-white flex items-center justify-center shrink-0 mt-0.5 text-xs">結</div>
                <div>
                  <h3 className="font-medium">テキストエディタ統合</h3>
                  <p className="text-sm text-gray-600">各シーンの詳細を書き込み、全体のストーリーを書き上げることができます。プロット構造と本文執筆を一つの画面で管理可能です。</p>
                </div>
              </li>
            </ul>
          </TabsContent>
          
          <TabsContent value="tutorial" className="mt-0">
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted p-3 font-medium">基本的な使い方</div>
                <div className="p-3 space-y-2">
                  <p className="text-sm">1. 左側のパネルからノードタイプ（起・承・転・結）をドラッグして作業エリアにドロップ</p>
                  <p className="text-sm">2. ノードをクリックして内容を編集</p>
                  <p className="text-sm">3. ノード同士をつないでストーリーの流れを作成</p>
                  <p className="text-sm">4. 右側のAIアシスタントに質問して、ストーリー構成のアドバイスを得る</p>
                </div>
              </div>
              
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted p-3 font-medium">ヒント</div>
                <div className="p-3 space-y-2">
                  <p className="text-sm">• 「起」は物語の導入部、「承」は展開、「転」は転換点、「結」は結末を表します</p>
                  <p className="text-sm">• シナリオセンター式では、キャラクターの二面性（長所と短所）が重要です</p>
                  <p className="text-sm">• ストーリーは「主人公の目的」と「それを阻む障害」が明確であることが理想的です</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="p-6 pt-0">
          <Button onClick={handleClose}>始める</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
