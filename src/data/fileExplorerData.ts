
import { FileNode } from '@/components/explorer/FileExplorerView';

export const sampleFileTree: FileNode[] = [
  {
    id: 'folder-1',
    name: '第一章：出会い',
    type: 'folder',
    children: [
      {
        id: 'folder-1-1',
        name: 'シークエンス',
        type: 'folder',
        children: [
          {
            id: 'file-1-1-1',
            name: 'シーン',
            type: 'file',
            content: '# シーン\n\n主人公と相手が出会うシーン。詳細をここに記述します。'
          }
        ]
      },
      {
        id: 'file-1-2',
        name: '第一章の構想.md',
        type: 'file',
        content: '# 第一章の構想\n\n主人公が冒険の世界に踏み出す最初の一歩。出会いと旅立ちのテーマを扱います。'
      }
    ]
  },
  {
    id: 'folder-2',
    name: '第二章：試練',
    type: 'folder',
    children: [
      {
        id: 'folder-2-1',
        name: 'シークエンス',
        type: 'folder',
        children: [
          {
            id: 'file-2-1-1',
            name: 'シーン1',
            type: 'file',
            content: '# シーン1\n\n主人公が最初の試練に直面するシーン。'
          },
          {
            id: 'file-2-1-2',
            name: 'シーン2',
            type: 'file',
            content: '# シーン2\n\n試練を乗り越えるために奮闘するシーン。'
          }
        ]
      }
    ]
  },
  {
    id: 'folder-3',
    name: 'キャラクター設定',
    type: 'folder',
    children: [
      {
        id: 'file-3-1',
        name: '主人公.md',
        type: 'file',
        content: '# 主人公\n\n- 年齢: 25歳\n- 職業: 冒険者\n- 性格: 好奇心旺盛で勇敢\n- 目的: 失われた宝物を見つけること'
      },
      {
        id: 'file-3-2',
        name: '相棒.md',
        type: 'file',
        content: '# 相棒\n\n- 年齢: 28歳\n- 職業: 魔法使い\n- 性格: 冷静沈着だが内に熱い情熱を秘めている\n- 能力: 風と水の魔法を操る'
      }
    ]
  }
];

// Add to localStorage if not exists
const initializeLocalStorage = () => {
  if (!localStorage.getItem('storyflow-files')) {
    localStorage.setItem('storyflow-files', JSON.stringify(sampleFileTree));
  }
};

// Get files from localStorage or sample data
export const getFileTree = (): FileNode[] => {
  initializeLocalStorage();
  try {
    const storedData = localStorage.getItem('storyflow-files');
    return storedData ? JSON.parse(storedData) : sampleFileTree;
  } catch (error) {
    console.error('Error loading file tree:', error);
    return sampleFileTree;
  }
};

// Save files to localStorage
export const saveFileTree = (fileTree: FileNode[]): void => {
  localStorage.setItem('storyflow-files', JSON.stringify(fileTree));
};
