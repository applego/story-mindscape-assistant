
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { BookOpen, MessageSquare, Users, Settings, Lightbulb, Home, Leaf, BookMarked, FileText } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

const StoryflowSidebar = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Set the active tab based on the current path
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/plots" || path === "/index") return "plots";
    return "home";
  });

  const menuItems = [
    { id: "home", icon: Home, label: "ホーム", description: "ダッシュボードと最近の作品", path: "/" },
    { id: "projects", icon: BookOpen, label: "プロジェクト", description: "作品一覧と管理", path: "/projects" },
    { id: "ideas", icon: Lightbulb, label: "アイデア", description: "ストーリーアイデアの整理", path: "/ideas" },
    { id: "characters", icon: Users, label: "キャラクター", description: "キャラクター設定と関係図", path: "/characters" },
    { id: "plots", icon: FileText, label: "プロット", description: "ストーリー構成の作成", path: "/" },
    { id: "drafts", icon: BookMarked, label: "原稿", description: "執筆中の原稿管理", path: "/drafts" },
    { id: "assistant", icon: MessageSquare, label: "アシスタント", description: "AIによる執筆サポート", path: "/assistant" },
    { id: "themes", icon: Leaf, label: "テーマ", description: "ストーリーテーマの設計", path: "/themes" },
    { id: "settings", icon: Settings, label: "設定", description: "アプリ設定とプロフィール", path: "/settings" },
  ];

  return (
    <Sidebar className="border-r">
      <SidebarContent className="py-4">
        <div className="mb-8 px-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-storyflow-ki to-storyflow-ketsu flex items-center justify-center text-white font-bold mb-2 mx-auto">
            S
          </div>
          <p className="text-xs text-center text-muted-foreground font-medium">StoryMindscape</p>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 mb-1">メニュー</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id} className="px-2 py-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            "w-full flex items-center justify-start h-10 rounded-md transition-all gap-3 px-3",
                            activeTab === item.id 
                              ? "bg-primary/10 text-primary" 
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          )}
                        >
                          <Link 
                            to={item.path} 
                            onClick={() => setActiveTab(item.id)}
                            className="flex items-center gap-3 w-full"
                          >
                            <item.icon size={20} />
                            <span className="hidden sm:inline-block">{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <SidebarTrigger className="rounded-full w-8 h-8 flex items-center justify-center border bg-white hover:bg-gray-100 transition-colors duration-200" />
      </div>
    </Sidebar>
  );
};

export default StoryflowSidebar;
