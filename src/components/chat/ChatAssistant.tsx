
import { useState, useRef, useEffect } from "react";
import { X, Send, Lightbulb, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

const suggestionPrompts = [
  {
    title: "ストーリーの起承転結",
    description: "物語全体の構造を考える",
    prompt: "この物語の起承転結の構造を整理したいです。アドバイスをください。"
  },
  {
    title: "キャラクターの二面性",
    description: "魅力的な登場人物を作る",
    prompt: "主人公の二面性（長所と短所）をもっと際立たせるにはどうすればよいでしょうか？"
  },
  {
    title: "物語のテーマを掘り下げる",
    description: "一貫したメッセージを作る",
    prompt: "この物語のテーマをもっと明確にしたいです。どうすればよいでしょうか？"
  },
  {
    title: "シーンの強化",
    description: "印象的な場面を作る",
    prompt: "「転」のクライマックスシーンをより印象的にするアイデアを教えてください。"
  },
  {
    title: "対立の作り方",
    description: "葛藤を生み出す",
    prompt: "主人公と敵対者の対立をより深く、複雑にするにはどうすればよいでしょうか？"
  }
];

const ChatAssistant = ({ isOpen, onClose }: ChatAssistantProps) => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "assistant",
      text: "こんにちは！ストーリー作成のお手伝いをします。プロット設計や物語の構成について質問があればお気軽にどうぞ。「起承転結」「キャラクターの二面性」「テーマ設計」などのシナリオセンター式の考え方を活用してアドバイスします。",
      timestamp: new Date()
    }
  ]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
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
        "プロットの構造がとても興味深いですね。起承転結をさらに強調するため、転のところでより大きな葛藤を加えてみてはいかがでしょうか？主人公が最も苦しむ瞬間を明確にすると、物語に深みが増します。",
        "このキャラクターの二面性が素晴らしいです。もう少し内面的な矛盾を掘り下げると、読者にとってさらに魅力的になるでしょう。例えば、強さと弱さが表裏一体になっているような設定はどうでしょうか？",
        "シナリオセンター式の観点では、主人公の目的がまだ少し曖昧かもしれません。「〜したい」という具体的な願望と、それを阻む内的・外的障害をより明確にすると物語が引き締まります。",
        "現在のシーンは「承」の部分にあたりますね。ここで伏線を張っておくと、「転」での展開がより効果的になります。読者が「あぁ、あのときのあれが伏線だったのか！」と感じる瞬間を作りましょう。",
        "キャラクターの動機付けがとても自然です。この内面的な葛藤を最終的な決断につなげると、感動的なストーリーアークになるでしょう。「自分の弱さを受け入れることで新たな強さを得る」というテーマを意識してみてはいかがでしょうか？"
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

  const handleSuggestionClick = (prompt: string) => {
    setInputValue(prompt);
    setActiveTab("chat");
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="px-3 pt-2 bg-transparent justify-start border-b rounded-none gap-2">
          <TabsTrigger value="chat" className="text-xs">チャット</TabsTrigger>
          <TabsTrigger value="suggestions" className="text-xs">ヒント</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 overflow-y-auto p-4 space-y-4 data-[state=inactive]:hidden">
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
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
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
        </TabsContent>
        
        <TabsContent value="suggestions" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">ストーリー作成のヒント</h4>
            <p className="text-xs text-gray-500">
              以下のプロンプトをクリックして、アシスタントに質問できます
            </p>
            
            <div className="grid gap-2">
              {suggestionPrompts.map((suggestion, index) => (
                <div 
                  key={index}
                  className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleSuggestionClick(suggestion.prompt)}
                >
                  <div className="flex justify-between items-start">
                    <h5 className="font-medium text-sm">{suggestion.title}</h5>
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="質問や指示を入力..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-lg"
                disabled={!inputValue.trim() || isThinking}
              >
                <Send size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>送信</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </form>
    </div>
  );
};

export default ChatAssistant;
