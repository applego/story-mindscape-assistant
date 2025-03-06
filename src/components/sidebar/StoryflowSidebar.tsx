import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import ProjectStatusPanel from "./ProjectStatusPanel";

const StoryflowSidebar = () => {
  const { state, toggleSidebar } = useSidebar();

  return (
    <div
      className={`h-full border-r border-gray-200 bg-white dark:bg-storyflow-dark-gray dark:border-storyflow-dark-border transition-all duration-200 ease-in-out ${
        state === "expanded" ? "w-[300px]" : "w-0"
      } flex flex-col overflow-hidden`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-storyflow-dark-border">
        <h2 className="font-medium dark:text-storyflow-dark-text">プロジェクト情報</h2>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <X className="h-4 w-4 dark:text-storyflow-dark-text" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <ProjectStatusPanel />
        
        {/* Other sidebar content can be added here */}
      </div>
    </div>
  );
};

export default StoryflowSidebar;
