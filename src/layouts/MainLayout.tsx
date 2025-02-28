
import { ReactNode, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import StoryflowSidebar from "@/components/sidebar/StoryflowSidebar";
import ChatAssistant from "@/components/chat/ChatAssistant";

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
            <div className="ml-auto flex items-center gap-4">
              <button 
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsChatOpen(!isChatOpen)}
              >
                {isChatOpen ? "Close" : "Open"} Assistant
              </button>
            </div>
          </header>
          
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
        
        <ChatAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
