
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MessageCircle, SendHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface FlowAIAssistantProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedNodeId: string | null;
}

const FlowAIAssistant = ({ isOpen, onOpenChange, selectedNodeId }: FlowAIAssistantProps) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: 'こんにちは！ストーリー作成のお手伝いをします。シーンについて質問や、アイデアが欲しい場合はお気軽にどうぞ。' }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // ユーザーメッセージをチャット履歴に追加
    setChatHistory(prev => [...prev, { role: 'user', content: message }]);
    
    // TODO: ここで実際のLLM APIと連携する予定
    // 現在はシンプルなデモレスポンスを表示
    setTimeout(() => {
      let response = '';
      
      if (selectedNodeId) {
        response = `選択中のシーンについてのアイデアですね。このシーンでは主人公の内面的な葛藤を描写してみてはいかがでしょうか？読者が感情移入しやすくなります。`;
      } else {
        response = `ストーリー全体の構成についてお考えでしょうか？キャラクターの動機を明確にし、各シーンがどのようにストーリーを前進させるか考えてみましょう。`;
      }
      
      setChatHistory(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle>AIアシスタント</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {chatHistory.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={selectedNodeId ? "このシーンについて質問する..." : "ストーリー全体について質問する..."}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button onClick={handleSendMessage}>
                <SendHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FlowAIAssistant;
