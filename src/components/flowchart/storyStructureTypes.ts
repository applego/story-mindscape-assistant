
// ストーリー階層構造の型定義

export type StoryPhase = 'ki' | 'sho' | 'ten' | 'ketsu';
export type NodeType = 'story' | 'storyline' | 'sequence' | 'scene' | 'action';

export interface StoryNodeBase {
  id: string;
  title: string;
  description: string;
  phase?: StoryPhase;
  tags?: string[];
  characters?: string[];
  notes?: string;
}

export interface StoryData extends StoryNodeBase {
  type: 'story';
}

export interface StorylineData extends StoryNodeBase {
  type: 'storyline';
  parentId: string; // 親ストーリーのID
}

export interface SequenceData extends StoryNodeBase {
  type: 'sequence';
  parentId: string; // 親ストーリーラインのID
}

export interface SceneData extends StoryNodeBase {
  type: 'scene';
  parentId: string; // 親シークエンスのID
  content: string;
}

export interface ActionData extends StoryNodeBase {
  type: 'action';
  parentId: string; // 親シーンのID
  actionType: 'action' | 'reaction' | 'dialogue' | 'thought';
  character: string; // 行動するキャラクター
  content: string;
}

export type StoryNodeData = 
  | StoryData 
  | StorylineData 
  | SequenceData 
  | SceneData 
  | ActionData;
