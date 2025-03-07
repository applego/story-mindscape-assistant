
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import ProjectStatusPanel from "./ProjectStatusPanel";
import FileExplorerView from "../explorer/FileExplorerView";
import { useEffect, useState } from "react";
import { FileNode } from "../explorer/FileExplorerView";
import { getFileTree, saveFileTree, syncPlotNodesToFileTree } from "@/data/fileExplorerData";
import { toast } from "sonner";
import { Node } from "@xyflow/react";
import { StoryNodeData } from "../flowchart/storyStructureTypes";

const StoryflowSidebar = () => {
  const { state, toggleSidebar } = useSidebar();
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [flowNodes, setFlowNodes] = useState<Node<StoryNodeData>[]>([]);

  // ファイルツリーとフローノードの初期ロード
  useEffect(() => {
    // ファイルツリーをロード
    setFileTree(getFileTree());
    
    // ストーリーフローノードをロード
    try {
      const savedFlow = localStorage.getItem('storyflow');
      if (savedFlow) {
        const flow = JSON.parse(savedFlow);
        setFlowNodes(flow.nodes || []);
      }
    } catch (error) {
      console.error('Error loading flow nodes:', error);
    }
  }, []);
  
  // ストーリーフローノードの変更を監視して同期
  useEffect(() => {
    const handleFlowSaved = () => {
      try {
        const savedFlow = localStorage.getItem('storyflow');
        if (savedFlow) {
          const flow = JSON.parse(savedFlow);
          setFlowNodes(flow.nodes || []);
        }
      } catch (error) {
        console.error('Error handling flow saved event:', error);
      }
    };

    window.addEventListener('flowSaved', handleFlowSaved);
    window.addEventListener('storage', handleFlowSaved);
    
    return () => {
      window.removeEventListener('flowSaved', handleFlowSaved);
      window.removeEventListener('storage', handleFlowSaved);
    };
  }, []);
  
  // フローノードが変更されたらファイルツリーを同期
  useEffect(() => {
    if (flowNodes.length > 0) {
      syncPlotNodesToFileTree(flowNodes);
      setFileTree(getFileTree());
    }
  }, [flowNodes]);

  const handleFileSelect = (file: FileNode) => {
    toast.info(`${file.name} を開きました`);
    // Here you can implement file content viewing in the main area
    console.log("Selected file:", file);
  };

  const handleFileTreeChange = (updatedTree: FileNode[]) => {
    setFileTree(updatedTree);
    saveFileTree(updatedTree);
  };

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
      
      <div className="flex-1 overflow-auto flex flex-col">
        {/* Project Status Panel - takes about 1/3 of the sidebar height */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <ProjectStatusPanel />
        </div>
        
        {/* File Explorer - takes about 2/3 of the sidebar height */}
        <div className="flex-1 min-h-0">
          <FileExplorerView 
            initialData={fileTree} 
            onFileSelect={handleFileSelect}
            onFileTreeChange={handleFileTreeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default StoryflowSidebar;
