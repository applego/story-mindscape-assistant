
import { useState, useRef, useEffect } from "react";
import { X, Send, Lightbulb, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const ChatAssistant = ({ isOpen, onClose }: ChatAssistantProps) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "こんにちは！ストーリー作成のお手伝いをします。プロット設計や物語の構成について質問があればお気軽にどうぞ。",
      timestamp: new Date()
    }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsThinking(true);

    // Simulate assistant response after a delay
    setTimeout(() => {
      const responses = [
        "プロットの構造がとても興味深いですね。起承転結をさらに強調するため、転のところでより大きな葛藤を加えてみてはいかがでしょうか？",
        "このキャラクターの二面性が素晴らしいです。もう少し内面的な矛盾を掘り下げると、読者にとってさらに魅力的になるでしょう。",
        "シナリオセンター式の観点では、主人公の目的がまだ少し曖昧かもしれません。もう少し具体的な目標を設定すると物語が引き締まります。",
        "現在のシーンは「承」の部分にあたりますね。ここで伏線を張っておくと、「転」での展開がより効果的になります。",
        "キャラクターの動機付けがとても自然です。この内面的な葛藤を最終的な決断につなげると、感動的なストーリーアークになるでしょう。"
      ];
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        sender: "assistant",
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div 
      className={cn(
        "fixed z-20 right-4 bottom-4 flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 transition-all duration-300 ease-in-out",
        isExpanded ? "w-[450px] h-[calc(100vh-32px)]" : "w-[350px] h-[450px]"
      )}
    >
      <div className="flex items-center justify-between p-3 border-b bg-gray-50 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Lightbulb size={18} />
          </div>
          <h3 className="font-medium">ストーリーアシスタント</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={onClose}
          >
            <X size={16} />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div 
              className={cn(
                "max-w-[80%] rounded-lg p-3 animate-slide-in",
                message.sender === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-gray-100 text-gray-800"
              )}
            >
              <p className="text-sm">{message.text}</p>
              <p className="text-xs mt-1 opacity-70 text-right">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-[80%]">
              <div className="flex space-x-1 items-center h-5">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="質問や指示を入力..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="rounded-lg"
          disabled={!inputValue.trim() || isThinking}
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
};

export default ChatAssistant;
