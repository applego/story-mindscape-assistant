import { Edge, Node, MarkerType } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';

// Sample nodes for the story structure
export const sampleStoryNodes: Node<StoryNodeData>[] = [
  {
    id: 'story-1',
    data: { 
      type: 'story', 
      title: 'サンプルストーリー',
      description: 'これはサンプルストーリーです。',
    },
    position: { x: 50, y: 50 },
    type: 'storyNode',
  },
  {
    id: 'storyline-1',
    data: { 
      type: 'storyline', 
      title: '第一章：出会い',
      description: '主人公が出会うシーン。',
      parentId: 'story-1',
      timePosition: 10,
    },
    position: { x: 250, y: 50 },
    type: 'storyNode',
    parentNode: 'story-1',
  },
  {
    id: 'sequence-1',
    data: { 
      type: 'sequence', 
      title: '街中での出会い',
      description: '街中で偶然出会うシーンのシークエンス。',
      parentId: 'storyline-1',
      timePosition: 10,
    },
    position: { x: 450, y: 50 },
    type: 'storyNode',
    parentNode: 'storyline-1',
  },
  {
    id: 'scene-1',
    data: { 
      type: 'scene', 
      title: 'カフェでの出会い',
      description: 'カフェで初めて言葉を交わすシーン。',
      parentId: 'sequence-1',
      phase: 'ki',
      content: 'カフェで向かい合って座る二人。',
      timePosition: 10,
    },
    position: { x: 650, y: 50 },
    type: 'storyNode',
    parentNode: 'sequence-1',
  },
  {
    id: 'action-1',
    data: { 
      type: 'action', 
      title: '自己紹介',
      description: 'お互いに自己紹介をする。',
      parentId: 'scene-1',
      actionType: 'dialogue',
      character: '主人公',
      content: '「こんにちは、私は〇〇です。」',
      timePosition: 10,
    },
    position: { x: 850, y: 50 },
    type: 'storyNode',
    parentNode: 'scene-1',
  }
];

// Sample edges for the story structure
export const sampleStoryEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'story-1',
    target: 'storyline-1',
    animated: false,
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  },
  {
    id: 'e2-3',
    source: 'storyline-1',
    target: 'sequence-1',
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  },
  {
    id: 'e3-4',
    source: 'sequence-1',
    target: 'scene-1',
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  },
  {
    id: 'e4-5',
    source: 'scene-1',
    target: 'action-1',
    markerEnd: {
      type: MarkerType.ArrowClosed
    }
  }
];
