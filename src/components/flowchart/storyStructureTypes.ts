
// ストーリー階層構造の型定義
import { Node } from '@xyflow/react';

export type StoryPhase = 'ki' | 'sho' | 'ten' | 'ketsu';
export type NodeType = 'story' | 'storyline' | 'sequence' | 'scene' | 'action';

// React Flow Nodeとの互換性のための拡張型
export interface StoryNodeBase {
  id: string;
  title: string;
  description: string;
  phase?: StoryPhase;
  tags?: string[];
  characters?: string[];
  notes?: string;
  timePosition?: number; // 時系列上の位置（0-100の値）
}

export interface StoryData extends StoryNodeBase {
  type: 'story';
}

export interface StorylineData extends StoryNodeBase {
  type: 'storyline';
  parentId?: string; // 親ストーリーのID
}

export interface SequenceData extends StoryNodeBase {
  type: 'sequence';
  parentId?: string; // 親ストーリーラインのID
}

export interface SceneData extends StoryNodeBase {
  type: 'scene';
  parentId?: string; // 親シークエンスのID
  content?: string;
}

export interface ActionData extends StoryNodeBase {
  type: 'action';
  parentId?: string; // 親シーンのID
  actionType?: 'action' | 'reaction' | 'dialogue' | 'thought';
  character?: string; // 行動するキャラクター
  content?: string;
}

export type StoryNodeData = 
  | StoryData 
  | StorylineData 
  | SequenceData 
  | SceneData 
  | ActionData;

// ReactFlowのNodeと統合したノードタイプ定義
export type FlowStoryNode = Node<StoryNodeData>;
