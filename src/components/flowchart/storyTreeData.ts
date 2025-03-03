
import { Node, Edge, MarkerType } from '@xyflow/react';
import { 
  StoryNodeData, 
  StoryData,
  StorylineData,
  SequenceData,
  SceneData
} from './storyStructureTypes';

export const generateNodeId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

// 初期ストーリーデータ
const storyId = 'story-1';
const storylineId1 = 'storyline-1';
const storylineId2 = 'storyline-2';
const sequenceId1 = 'sequence-1';
const sequenceId2 = 'sequence-2';

export const initialStoryNodes: Node<StoryNodeData>[] = [
  // ルートノード：物語
  {
    id: storyId,
    type: 'storyNode',
    position: { x: 400, y: 50 },
    data: { 
      type: 'story',
      title: '物語のタイトル',
      description: 'あなたの物語の全体的なテーマと目的',
      tags: ['ファンタジー', '冒険'],
    },
  },
  
  // ストーリーライン（複数のストーリーラインが1つの物語を構成）
  {
    id: storylineId1,
    type: 'storyNode',
    position: { x: 200, y: 200 },
    data: { 
      type: 'storyline',
      parentId: storyId,
      title: '主人公の冒険',
      description: '主人公が異世界で力を得て成長する物語',
      phase: 'ki',
    },
  },
  {
    id: storylineId2,
    type: 'storyNode',
    position: { x: 600, y: 200 },
    data: { 
      type: 'storyline',
      parentId: storyId,
      title: '仲間との絆',
      description: '主人公と仲間たちの関係性が発展する副筋',
      phase: 'sho',
    },
  },
  
  // シークエンス（1つのストーリーラインは複数のシークエンスで構成）
  {
    id: sequenceId1,
    type: 'storyNode',
    position: { x: 200, y: 350 },
    data: { 
      type: 'sequence',
      parentId: storylineId1,
      title: '異世界への旅立ち',
      description: '主人公が異世界へ召喚され、初めての試練に直面する',
      phase: 'ki',
    },
  },
  {
    id: sequenceId2,
    type: 'storyNode',
    position: { x: 600, y: 350 },
    data: { 
      type: 'sequence',
      parentId: storylineId2,
      title: '仲間との出会い',
      description: '主人公が冒険の仲間と出会い、初めて協力して戦う',
      phase: 'sho',
    },
  },
  
  // シーン（1つのシークエンスは複数のシーンで構成）
  {
    id: 'scene-1',
    type: 'storyNode',
    position: { x: 100, y: 500 },
    data: { 
      type: 'scene',
      parentId: sequenceId1,
      title: '異世界への召喚',
      description: '主人公が光に包まれ、謎の声に導かれて異世界へ転移する',
      phase: 'ki',
      content: '',
      characters: ['主人公'],
    },
  },
  {
    id: 'scene-2',
    type: 'storyNode',
    position: { x: 300, y: 500 },
    data: { 
      type: 'scene',
      parentId: sequenceId1,
      title: '異世界での目覚め',
      description: '見知らぬ世界で目を覚ました主人公が、最初の住人と出会う',
      phase: 'ki',
      content: '',
      characters: ['主人公', '案内人'],
    },
  },
  {
    id: 'scene-3',
    type: 'storyNode',
    position: { x: 500, y: 500 },
    data: { 
      type: 'scene',
      parentId: sequenceId2,
      title: '魔法使いとの出会い',
      description: '森で迷った主人公が魔法使いの少女に助けられる',
      phase: 'sho',
      content: '',
      characters: ['主人公', '魔法使い'],
    },
  },
  {
    id: 'scene-4',
    type: 'storyNode',
    position: { x: 700, y: 500 },
    data: { 
      type: 'scene',
      parentId: sequenceId2,
      title: '最初の共闘',
      description: 'モンスターとの戦いで、仲間との連携を学ぶ',
      phase: 'sho',
      content: '',
      characters: ['主人公', '魔法使い', 'モンスター'],
    },
  },
  
  // アクション（シーンの中の具体的な行動）
  {
    id: 'action-1',
    type: 'storyNode',
    position: { x: 100, y: 650 },
    data: { 
      type: 'action',
      parentId: 'scene-1',
      title: '召喚の瞬間',
      description: '主人公が読書中に突然光に包まれる',
      actionType: 'action',
      character: '主人公',
      content: '太郎は静かな図書館で本を読んでいた。突然、ページから金色の光が漏れ出し、彼の体を包み込んだ。',
    },
  },
  {
    id: 'action-2',
    type: 'storyNode',
    position: { x: 300, y: 650 },
    data: { 
      type: 'action',
      parentId: 'scene-2',
      title: '案内人との対話',
      description: '案内人が主人公に世界の説明をする',
      actionType: 'dialogue',
      character: '案内人',
      content: '「ようこそ、勇者様。あなたは預言通り、我々の世界を救うためにやってきたのです」',
    },
  },
];

export const initialStoryEdges: Edge[] = [
  // ストーリーからストーリーラインへの接続
  {
    id: `edge-${storyId}-${storylineId1}`,
    source: storyId,
    target: storylineId1,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: `edge-${storyId}-${storylineId2}`,
    source: storyId,
    target: storylineId2,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  
  // ストーリーラインからシークエンスへの接続
  {
    id: `edge-${storylineId1}-${sequenceId1}`,
    source: storylineId1,
    target: sequenceId1,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: `edge-${storylineId2}-${sequenceId2}`,
    source: storylineId2,
    target: sequenceId2,
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  
  // シークエンスからシーンへの接続
  {
    id: 'edge-sequence1-scene1',
    source: sequenceId1,
    target: 'scene-1',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge-sequence1-scene2',
    source: sequenceId1,
    target: 'scene-2',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge-sequence2-scene3',
    source: sequenceId2,
    target: 'scene-3',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge-sequence2-scene4',
    source: sequenceId2,
    target: 'scene-4',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  
  // シーンからアクションへの接続
  {
    id: 'edge-scene1-action1',
    source: 'scene-1',
    target: 'action-1',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge-scene2-action2',
    source: 'scene-2',
    target: 'action-2',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
];
