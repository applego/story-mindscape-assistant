
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
import { BookOpen, MessageSquare, Users, Settings, Lightbulb, Home, Leaf } from "lucide-react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const StoryflowSidebar = () => {
  const [activeTab, setActiveTab] = useState("home");

  const menuItems = [
    { id: "home", icon: Home, label: "Home" },
    { id: "projects", icon: BookOpen, label: "Projects" },
    { id: "ideas", icon: Lightbulb, label: "Ideas" },
    { id: "characters", icon: Users, label: "Characters" },
    { id: "assistant", icon: MessageSquare, label: "Assistant" },
    { id: "themes", icon: Leaf, label: "Themes" },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <Sidebar>
      <SidebarContent className="py-4">
        <div className="mb-8 px-4">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-storyflow-ki to-storyflow-ketsu flex items-center justify-center text-white font-bold mb-2 mx-auto">
            S
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.id} className="px-2 py-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            "w-full flex items-center justify-center h-10 rounded-md transition-all",
                            activeTab === item.id 
                              ? "bg-primary/10 text-primary" 
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                          )}
                          onClick={() => setActiveTab(item.id)}
                        >
                          <item.icon size={20} />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.label}
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
