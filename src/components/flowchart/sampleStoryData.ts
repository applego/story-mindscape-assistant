
import { Edge, Node } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';

export const sampleStoryNodes: Node<StoryNodeData>[] = [
  {
    id: 'node-1',
    type: 'storyNode',
    position: { x: 100, y: 100 },
    data: { 
      id: 'node-1',
      type: 'scene',
      label: '起：主人公の日常', 
      description: '主人公の通常世界を描写し、物語の世界観を確立する。主人公の目標や願望を示し、共感を生み出す。',
      phase: 'ki',
      content: '主人公のジョンは平凡なオフィスワーカーだった。毎日同じルーティンの繰り返しで、かつて持っていた冒険への情熱は忘れ去られていた。しかし、彼の心の奥底には、何か大きなことを成し遂げたいという願望がくすぶっていた。',
      title: '主人公の日常',
      characters: [],
      tags: [],
      notes: '',
      timePosition: 0
    } as StoryNodeData,
  },
  {
    id: 'node-2',
    type: 'storyNode',
    position: { x: 350, y: 100 },
    data: { 
      id: 'node-2',
      type: 'scene',
      label: '起：冒険への誘い', 
      description: '主人公が冒険に誘われるか、平穏な日常に変化が起きる。まだ冒険の始まりではない。',
      phase: 'ki',
      content: 'ある日、ジョンは奇妙な招待状を受け取る。それは彼の祖父から遺されたという古い地図と、「真の財宝はまだ見つかっていない」というメッセージだった。彼は当初、それを無視しようとしたが、毎日の退屈な生活から抜け出すチャンスかもしれないという思いが頭をよぎった。',
      title: '冒険への誘い',
      characters: [],
      tags: [],
      notes: '',
      timePosition: 20
    } as StoryNodeData,
  },
  {
    id: 'node-3',
    type: 'storyNode',
    position: { x: 350, y: 250 },
    data: { 
      id: 'node-3',
      type: 'scene',
      label: '承：最初の試練', 
      description: '主人公は冒険の世界に入り、新たな法則や仲間と出会う。最初の小さな試練を乗り越える。',
      phase: 'sho',
      content: 'ジョンは休暇を取り、地図に記された最初の場所へと向かった。そこで彼は冒険家のマヤと出会う。最初は互いに警戒しあうが、同じ目的を持っていることが分かり、協力することになる。二人は最初の手がかりを見つけるため、危険な崖を登らなければならなかった。',
      title: '最初の試練',
      characters: [],
      tags: [],
      notes: '',
      timePosition: 40
    } as StoryNodeData,
  },
  {
    id: 'node-4',
    type: 'storyNode',
    position: { x: 600, y: 250 },
    data: { 
      id: 'node-4',
      type: 'scene',
      label: '転：大きな危機', 
      description: '物語の転換点。主人公は最大の危機や試練に直面し、これまでの考え方や方法では乗り越えられないことに気づく。',
      phase: 'ten',
      content: '手がかりを追ううちに、ジョンとマヤは真の財宝を狙う謎の組織の存在に気づく。彼らは罠にはめられ、古代寺院に閉じ込められてしまう。酸素が徐々に薄くなる中、ジョンは自分の限界に直面する。彼は今までのように論理的に考えるだけでは、この危機を脱出できないことを悟る。',
      title: '大きな危機',
      characters: [],
      tags: [],
      notes: '',
      timePosition: 60
    } as StoryNodeData,
  },
  {
    id: 'node-5',
    type: 'storyNode',
    position: { x: 850, y: 250 },
    data: { 
      id: 'node-5',
      type: 'scene',
      label: '結：変化と成長', 
      description: '主人公は試練を乗り越え、内面的・外面的に変化を遂げる。元の世界に戻るか、新たな世界で生きることを選ぶ。',
      phase: 'ketsu',
      content: 'ジョンは直感と勇気を信じ、祖父の残した暗号を解読。脱出経路を見つけ出す。彼らは財宝を手に入れるが、それは金銀財宝ではなく、失われた古代文明の知恵が詰まった書物だった。ジョンは会社に戻るが、もはや以前の彼ではない。彼は週末冒険家として、未知の場所を探検することを続け、自分の人生に新たな意味を見出した。',
      title: '変化と成長',
      characters: [],
      tags: [],
      notes: '',
      timePosition: 80
    } as StoryNodeData,
  },
];

export const sampleStoryEdges: Edge[] = [
  { id: 'e1-2', source: 'node-1', target: 'node-2', animated: true, type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
  { id: 'e2-3', source: 'node-2', target: 'node-3', animated: true, type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
  { id: 'e3-4', source: 'node-3', target: 'node-4', animated: true, type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
  { id: 'e4-5', source: 'node-4', target: 'node-5', animated: true, type: 'smoothstep', markerEnd: { type: 'arrowclosed' } },
];
