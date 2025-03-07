
import { FileNode } from '@/components/explorer/FileExplorerView';

export const sampleFileTree: FileNode[] = [
  {
    id: 'folder-1',
    name: '第一章',
    type: 'folder',
    children: [
      {
        id: 'file-1',
        name: '主人公の紹介.md',
        type: 'file',
        content: '# 主人公の紹介\n\n山田太郎は28歳のプログラマー。趣味は読書と散歩。'
      },
      {
        id: 'file-2',
        name: '冒険の始まり.md',
        type: 'file',
        content: '# 冒険の始まり\n\n太郎は普段通りの朝を迎えたが、メールボックスには奇妙な招待状が届いていた。'
      }
    ]
  },
  {
    id: 'folder-2',
    name: '第二章',
    type: 'folder',
    children: [
      {
        id: 'file-3',
        name: '謎の人物.md',
        type: 'file',
        content: '# 謎の人物\n\n黒いスーツを着た男性が太郎に近づいてきた。「お待ちしておりました」と彼は言った。'
      }
    ]
  },
  {
    id: 'folder-3',
    name: 'キャラクター設定',
    type: 'folder',
    children: [
      {
        id: 'file-4',
        name: '山田太郎.md',
        type: 'file',
        content: '# 山田太郎\n\n- 年齢: 28歳\n- 職業: プログラマー\n- 性格: 慎重だが好奇心旺盛'
      },
      {
        id: 'file-5',
        name: '鈴木花子.md',
        type: 'file',
        content: '# 鈴木花子\n\n- 年齢: 25歳\n- 職業: デザイナー\n- 性格: 社交的で明るい'
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
