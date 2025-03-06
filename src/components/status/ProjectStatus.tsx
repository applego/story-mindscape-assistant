
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  BookText, 
  Route, 
  Layout, 
  Film, 
  UserCircle, 
  Users, 
  Lightbulb, 
  MapPin 
} from "lucide-react";
import { Node } from '@xyflow/react';
import { StoryNodeData } from '../flowchart/storyStructureTypes';

type ProjectStats = {
  characters: number;
  ideas: number;
  locations: number;
  storyNodes: {
    story: number;
    storyline: number;
    sequence: number;
    scene: number;
    action: number;
    total: number;
  };
};

interface ProjectStatusProps {
  nodes: Node<StoryNodeData>[];
}

const ProjectStatus: React.FC<ProjectStatusProps> = ({ nodes }) => {
  const [stats, setStats] = useState<ProjectStats>({
    characters: 0,
    ideas: 0,
    locations: 0,
    storyNodes: {
      story: 0,
      storyline: 0,
      sequence: 0,
      scene: 0,
      action: 0,
      total: 0
    }
  });

  useEffect(() => {
    // Count the different types of story nodes
    const storyNodes = {
      story: 0,
      storyline: 0,
      sequence: 0,
      scene: 0,
      action: 0,
      total: 0
    };

    nodes.forEach(node => {
      if (node.data.type) {
        storyNodes[node.data.type as keyof typeof storyNodes] += 1;
        storyNodes.total += 1;
      }
    });

    // For now we're using placeholder values for characters, ideas, and locations
    // In a real implementation, these would come from their respective data stores
    setStats({
      characters: localStorage.getItem('characterCount') ? parseInt(localStorage.getItem('characterCount') || '0') : 0,
      ideas: localStorage.getItem('ideaCount') ? parseInt(localStorage.getItem('ideaCount') || '0') : 0,
      locations: localStorage.getItem('locationCount') ? parseInt(localStorage.getItem('locationCount') || '0') : 0,
      storyNodes
    });
  }, [nodes]);

  const renderNodeTypeIcon = (type: string) => {
    switch (type) {
      case 'story':
        return <BookText className="h-4 w-4 text-blue-500" />;
      case 'storyline':
        return <Route className="h-4 w-4 text-purple-500" />;
      case 'sequence':
        return <Layout className="h-4 w-4 text-indigo-500" />;
      case 'scene':
        return <Film className="h-4 w-4 text-green-500" />;
      case 'action':
        return <UserCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="dark:bg-storyflow-dark-gray dark:border-storyflow-dark-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium dark:text-storyflow-dark-text">プロジェクト状況</CardTitle>
        <CardDescription className="dark:text-gray-400">現在の作品構成要素</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium dark:text-storyflow-dark-text">キャラクター</span>
            </div>
            <span className="font-semibold dark:text-storyflow-dark-text">{stats.characters}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              <span className="text-sm font-medium dark:text-storyflow-dark-text">アイデア</span>
            </div>
            <span className="font-semibold dark:text-storyflow-dark-text">{stats.ideas}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm font-medium dark:text-storyflow-dark-text">舞台・場所</span>
            </div>
            <span className="font-semibold dark:text-storyflow-dark-text">{stats.locations}</span>
          </div>
          
          <Separator className="my-2 dark:bg-storyflow-dark-border" />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium dark:text-gray-400">プロット要素</h4>
            
            <div className="grid grid-cols-2 gap-y-2">
              <div className="flex items-center gap-2">
                {renderNodeTypeIcon('story')}
                <span className="text-xs dark:text-storyflow-dark-text">ストーリー</span>
              </div>
              <span className="text-xs text-right font-medium dark:text-storyflow-dark-text">{stats.storyNodes.story}</span>
              
              <div className="flex items-center gap-2">
                {renderNodeTypeIcon('storyline')}
                <span className="text-xs dark:text-storyflow-dark-text">ストーリーライン</span>
              </div>
              <span className="text-xs text-right font-medium dark:text-storyflow-dark-text">{stats.storyNodes.storyline}</span>
              
              <div className="flex items-center gap-2">
                {renderNodeTypeIcon('sequence')}
                <span className="text-xs dark:text-storyflow-dark-text">シークエンス</span>
              </div>
              <span className="text-xs text-right font-medium dark:text-storyflow-dark-text">{stats.storyNodes.sequence}</span>
              
              <div className="flex items-center gap-2">
                {renderNodeTypeIcon('scene')}
                <span className="text-xs dark:text-storyflow-dark-text">シーン</span>
              </div>
              <span className="text-xs text-right font-medium dark:text-storyflow-dark-text">{stats.storyNodes.scene}</span>
              
              <div className="flex items-center gap-2">
                {renderNodeTypeIcon('action')}
                <span className="text-xs dark:text-storyflow-dark-text">アクション</span>
              </div>
              <span className="text-xs text-right font-medium dark:text-storyflow-dark-text">{stats.storyNodes.action}</span>
            </div>
            
            <Separator className="my-2 dark:bg-storyflow-dark-border" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium dark:text-storyflow-dark-text">合計</span>
              <span className="font-semibold dark:text-storyflow-dark-text">{stats.storyNodes.total}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectStatus;
