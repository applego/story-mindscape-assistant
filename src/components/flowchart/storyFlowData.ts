
import { Node, Edge, MarkerType } from '@xyflow/react';
import { StoryNodeData } from './nodes/StoryNode';

export const generateNodeId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

export const initialNodes: Node<StoryNodeData>[] = [
  {
    id: 'node-1',
    type: 'storyNode',
    position: { x: 100, y: 100 },
    data: { 
      label: '起：主人公の日常', 
      description: '主人公の通常世界を描写し、物語の世界観を確立する。主人公の目標や願望を示し、共感を生み出す。',
      phase: 'ki',
      content: '',
      title: '主人公の日常',
      characters: [],
      tags: [],
      notes: ''
    },
  },
  {
    id: 'node-2',
    type: 'storyNode',
    position: { x: 350, y: 100 },
    data: { 
      label: '起：冒険への誘い', 
      description: '主人公が冒険に誘われるか、平穏な日常に変化が起きる。まだ冒険の始まりではない。',
      phase: 'ki',
      content: '',
      title: '冒険への誘い',
      characters: [],
      tags: [],
      notes: ''
    },
  },
  {
    id: 'node-3',
    type: 'storyNode',
    position: { x: 350, y: 250 },
    data: { 
      label: '承：最初の試練', 
      description: '主人公は冒険の世界に入り、新たな法則や仲間と出会う。最初の小さな試練を乗り越える。',
      phase: 'sho',
      content: '',
      title: '最初の試練',
      characters: [],
      tags: [],
      notes: ''
    },
  },
  {
    id: 'node-4',
    type: 'storyNode',
    position: { x: 600, y: 250 },
    data: { 
      label: '転：大きな危機', 
      description: '物語の転換点。主人公は最大の危機や試練に直面し、これまでの考え方や方法では乗り越えられないことに気づく。',
      phase: 'ten',
      content: '',
      title: '大きな危機',
      characters: [],
      tags: [],
      notes: ''
    },
  },
  {
    id: 'node-5',
    type: 'storyNode',
    position: { x: 850, y: 250 },
    data: { 
      label: '結：変化と成長', 
      description: '主人公は試練を乗り越え、内面的・外面的に変化を遂げる。元の世界に戻るか、新たな世界で生きることを選ぶ。',
      phase: 'ketsu',
      content: '',
      title: '変化と成長',
      characters: [],
      tags: [],
      notes: ''
    },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'edge-1-2',
    source: 'node-1',
    target: 'node-2',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge-2-3',
    source: 'node-2',
    target: 'node-3',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge-3-4',
    source: 'node-3',
    target: 'node-4',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
  {
    id: 'edge-4-5',
    source: 'node-4',
    target: 'node-5',
    animated: true,
    markerEnd: { type: MarkerType.ArrowClosed },
    style: { strokeWidth: 2 },
  },
];
