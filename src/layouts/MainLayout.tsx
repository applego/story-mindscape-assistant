
import { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import StoryflowSidebar from "@/components/sidebar/StoryflowSidebar";
import ChatAssistant from "@/components/chat/ChatAssistant";
import { Button } from "@/components/ui/button";
import { MessageSquare, Save, Share, Settings, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <SidebarProvider>
      <div className="h-full flex w-full">
        <StoryflowSidebar />
        
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <header className="h-16 border-b flex items-center px-6 bg-white/80 backdrop-blur-sm z-10">
            <h1 className="text-xl font-medium">StoryMindscape</h1>
            
            <div className="ml-8 flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Save className="h-4 w-4 mr-1" />
                保存
              </Button>
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-1" />
                共有
              </Button>
            </div>
            
            <Separator orientation="vertical" className="mx-4 h-8" />
            
            <div className="text-xs text-gray-500">
              最終更新: 2023/07/01 13:45
            </div>
            
            <div className="ml-auto flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
              <Button 
                variant={isChatOpen ? "secondary" : "outline"}
                size="sm"
                className="gap-1"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                <MessageSquare className="h-4 w-4" />
                {isChatOpen ? "アシスタントを閉じる" : "アシスタントを開く"}
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto bg-gray-50">
            {children}
          </main>
        </div>
        
        <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
