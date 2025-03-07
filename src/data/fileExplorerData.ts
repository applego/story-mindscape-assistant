
import { FileNode } from '@/components/explorer/FileExplorerView';
import { Character } from './characterData';
import { Node } from '@xyflow/react';
import { StoryNodeData } from '@/components/flowchart/storyStructureTypes';

// ファイルエクスプローラーの初期データ
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

// LocalStorageの初期化
const initializeLocalStorage = () => {
  if (!localStorage.getItem('storyflow-files')) {
    localStorage.setItem('storyflow-files', JSON.stringify(sampleFileTree));
  }
};

// LocalStorageからファイルツリーを取得
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

// ファイルツリーをLocalStorageに保存
export const saveFileTree = (fileTree: FileNode[]): void => {
  localStorage.setItem('storyflow-files', JSON.stringify(fileTree));
};

// プロットノードからファイルツリーを更新する関数
export const syncPlotNodesToFileTree = (nodes: Node<StoryNodeData>[]): void => {
  // 現在のファイルツリーを取得
  const currentFileTree = getFileTree();
  
  // プロットからの章・シークエンス・シーンを取得
  const chapters = nodes.filter(node => node.data.type === 'story');
  
  // 章ごとに処理
  chapters.forEach(chapter => {
    // 章に対応するフォルダを検索または作成
    let chapterFolder = currentFileTree.find(
      item => item.type === 'folder' && item.name.includes(chapter.data.title)
    );
    
    // 既存の章フォルダがない場合は新規作成
    if (!chapterFolder) {
      chapterFolder = {
        id: `folder-chapter-${chapter.id}`,
        name: chapter.data.title,
        type: 'folder',
        children: []
      };
      currentFileTree.push(chapterFolder);
    }
    
    // シークエンスを取得（この章の子ノード）
    const sequences = nodes.filter(
      node => node.data.type === 'sequence' && node.data.parentId === chapter.id
    );
    
    // シークエンスフォルダを検索または作成
    let sequencesFolder = chapterFolder.children?.find(
      item => item.type === 'folder' && item.name === 'シークエンス'
    );
    
    if (!sequencesFolder) {
      sequencesFolder = {
        id: `folder-sequences-${chapter.id}`,
        name: 'シークエンス',
        type: 'folder',
        children: []
      };
      chapterFolder.children = [...(chapterFolder.children || []), sequencesFolder];
    }
    
    // 各シークエンスに対応するシーンファイルを作成
    sequences.forEach(sequence => {
      // このシークエンスに対応するシーンを取得
      const scenes = nodes.filter(
        node => node.data.type === 'scene' && node.data.parentId === sequence.id
      );
      
      scenes.forEach(scene => {
        // シーンファイルを検索または作成
        const sceneFileName = scene.data.title;
        const sceneFile = sequencesFolder.children?.find(
          item => item.type === 'file' && item.name === `${sceneFileName}.md`
        );
        
        if (!sceneFile) {
          const newSceneFile = {
            id: `file-scene-${scene.id}`,
            name: `${sceneFileName}.md`,
            type: 'file' as const,
            content: `# ${sceneFileName}\n\n${scene.data.description || '説明をここに記入してください。'}\n\n${scene.data.content || ''}`
          };
          
          sequencesFolder.children = [...(sequencesFolder.children || []), newSceneFile];
        }
      });
    });
  });
  
  // 更新したファイルツリーを保存
  saveFileTree(currentFileTree);
};

// キャラクターデータからファイルツリーを更新する関数
export const syncCharactersToFileTree = (characters: Character[]): void => {
  // 現在のファイルツリーを取得
  const currentFileTree = getFileTree();
  
  // キャラクター設定フォルダを検索または作成
  let charactersFolder = currentFileTree.find(
    item => item.type === 'folder' && item.name === 'キャラクター設定'
  );
  
  // キャラクターフォルダがない場合は新規作成
  if (!charactersFolder) {
    charactersFolder = {
      id: 'folder-characters',
      name: 'キャラクター設定',
      type: 'folder',
      children: []
    };
    currentFileTree.push(charactersFolder);
  }
  
  // 既存のキャラクターファイル一覧
  const existingCharacterFiles = charactersFolder.children || [];
  
  // 各キャラクターに対するファイルを更新
  characters.forEach(character => {
    // キャラクターのファイル名
    const fileName = `${character.name || '名前なし'}.md`;
    
    // 既存のファイルを探す
    const existingFile = existingCharacterFiles.find(
      file => file.type === 'file' && file.name === fileName
    );
    
    // キャラクター情報をマークダウンに変換
    const content = `# ${character.name || '名前なし'}\n\n` +
      `- 性格: ${character.personality || '未設定'}\n` +
      `- 長所: ${character.strengths || '未設定'}\n` +
      `- 短所: ${character.weaknesses || '未設定'}\n` +
      `- 背景: ${character.background || '未設定'}\n` +
      `- 役割: ${character.role || '未設定'}\n`;
    
    if (existingFile) {
      // 既存ファイルの内容を更新
      existingFile.content = content;
    } else {
      // 新規ファイルを作成
      const newFile = {
        id: `file-character-${character.id}`,
        name: fileName,
        type: 'file' as const,
        content: content
      };
      
      charactersFolder.children = [...(charactersFolder.children || []), newFile];
    }
  });
  
  // 更新したファイルツリーを保存
  saveFileTree(currentFileTree);
};
