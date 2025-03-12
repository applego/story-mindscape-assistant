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
      },
      {
        id: 'file-1-3',
        name: '執筆プロンプト.md',
        type: 'file',
        content: '# 執筆プロンプト\n\n## 読者がページをめくる理由\n\n### 1. 未来が気になる\n読者は次に何が起こるのか知りたいと思っています。\n\n### 2. 過去が気になる\nキャラクターの過去や背景が気になります。\n\n### 3. 現在起きていることが気になる\n今まさに展開されている状況が気になります。\n\n## シーン執筆のポイント\n- 使用キャラクター: 主人公、相棒\n- 舞台設定: 森の入り口\n- 状況: 主人公が初めて冒険に踏み出す場面\n- 狙うべき感情: 緊張と期待'
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
      },
      {
        id: 'file-2-2',
        name: '執筆プロンプト.md',
        type: 'file',
        content: '# 執筆プロンプト\n\n## 読者がページをめくる理由\n\n### 1. 未来が気になる\n読者は主人公が試練を乗り越えられるか知りたいと思っています。\n\n### 2. 過去が気になる\nなぜこの試練が主人公に与えられたのか気になります。\n\n### 3. 現在起きていることが気になる\n試練の真の性質と、それが主人公にもたらす変化が気になります。\n\n## シーン執筆のポイント\n- 使用キャラクター: 主人公、敵対者\n- 舞台設定: 洞窟の奥深く\n- 状況: 主人公が予想外の障害に直面する\n- 狙うべき感情: 恐怖と決意'
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

// 最も長いパスの名前を生成（リネーム防止のため）
const generateUniqueFileName = (baseName: string, existingNames: string[]): string => {
  if (!existingNames.includes(baseName)) return baseName;
  let counter = 1;
  while (existingNames.includes(`${baseName} (${counter})`)) {
    counter++;
  }
  return `${baseName} (${counter})`;
};

// キャラクター設定に関連する執筆プロンプトを作成
const createCharacterWritingPrompt = (characters: Character[]): string => {
  let content = '# キャラクター執筆プロンプト\n\n';
  content += '## 主要キャラクター\n\n';
  
  characters.forEach(character => {
    content += `### ${character.name || '名前なし'}\n`;
    content += `- 性格: ${character.personality || '未設定'}\n`;
    content += `- 長所: ${character.strengths || '未設定'}\n`;
    content += `- 短所: ${character.weaknesses || '未設定'}\n`;
    content += `- 役割: ${character.role || '未設定'}\n\n`;
  });
  
  content += '## 対話執筆のポイント\n';
  content += '- 各キャラクターの声や話し方の特徴を一貫させる\n';
  content += '- 対話を通じてキャラクターの関係性を示す\n';
  content += '- 内面の葛藤を対話の中に織り込む\n\n';
  
  content += '## 読者がページをめくる理由\n';
  content += '1. 未来が気になる - キャラクターが次にどうなるのか\n';
  content += '2. 過去が気になる - キャラクターの隠された過去\n';
  content += '3. 現在起きていることが気になる - キャラクター間の緊張関係\n';
  
  return content;
};

// 読者がページをめくる理由のテンプレート
const getReaderHookTemplate = (title: string): string => {
  return `## 読者がページをめくる理由\n\n` +
         `### 1. 未来が気になる\n${title}の後に何が起こるのか知りたいと思わせる。\n\n` +
         `### 2. 過去が気になる\n${title}に至るまでの背景や伏線が気になる。\n\n` +
         `### 3. 現在起きていることが気になる\n${title}で今まさに展開される状況の行方が気になる。`;
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
        name: chapter.data.title || '無題の章',
        type: 'folder',
        children: []
      };
      currentFileTree.push(chapterFolder);
    }
    
    // 執筆プロンプトファイルを確認または作成
    let promptFile = chapterFolder.children?.find(
      item => item.type === 'file' && item.name === '執筆プロンプト.md'
    );
    
    if (!promptFile) {
      promptFile = {
        id: `file-prompt-${chapter.id}`,
        name: '執筆プロンプト.md',
        type: 'file',
        content: `# ${chapter.data.title || '無題の章'}の執筆プロンプト\n\n` +
                `${getReaderHookTemplate(chapter.data.title || '無題の章')}\n\n` +
                '## シーン執筆のポイント\n' +
                `- 使用キャラクター: ${chapter.data.characters?.join(', ') || '未設定'}\n` +
                `- 舞台設定: ${chapter.data.setting || '未設定'}\n` +
                `- 状況: ${chapter.data.description || '未設定'}\n` +
                '- 狙うべき感情: 緊張と期待'
      };
      chapterFolder.children = [...(chapterFolder.children || []), promptFile];
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
      
      // このシークエンスのフォルダを作成
      let sequenceFolder = sequencesFolder.children?.find(
        item => item.type === 'folder' && item.name === sequence.data.title
      );
      
      if (!sequenceFolder) {
        sequenceFolder = {
          id: `folder-sequence-${sequence.id}`,
          name: sequence.data.title || '無題のシークエンス',
          type: 'folder',
          children: []
        };
        sequencesFolder.children = [...(sequencesFolder.children || []), sequenceFolder];
      }
      
      // シークエンス詳細ファイルを追加
      let sequenceInfoFile = sequenceFolder.children?.find(
        item => item.type === 'file' && item.name === '概要.md'
      );
      
      if (!sequenceInfoFile) {
        sequenceInfoFile = {
          id: `file-sequence-info-${sequence.id}`,
          name: '概要.md',
          type: 'file',
          content: `# ${sequence.data.title || '無題のシークエンス'}\n\n` +
                  `${sequence.data.description || '説明をここに記入してください。'}\n\n` +
                  `## 目的\n${sequence.data.purpose || 'このシークエンスの目的を記入してください。'}\n\n` +
                  `## 含まれるシーン\n${scenes.map(s => `- ${s.data.title || '無題のシーン'}`).join('\n') || '- シーンはまだありません'}`
        };
        sequenceFolder.children = [...(sequenceFolder.children || []), sequenceInfoFile];
      }
      
      // シークエンスの執筆プロンプトを追加
      let sequencePromptFile = sequenceFolder.children?.find(
        item => item.type === 'file' && item.name === 'プロンプト.md'
      );
      
      if (!sequencePromptFile) {
        sequencePromptFile = {
          id: `file-sequence-prompt-${sequence.id}`,
          name: 'プロンプト.md',
          type: 'file',
          content: `# ${sequence.data.title || '無題のシークエンス'}の執筆プロンプト\n\n` +
                  `${getReaderHookTemplate(sequence.data.title || '無題のシークエンス')}\n\n` +
                  `## シークエンスの重要ポイント\n` +
                  `- 物語上の役割: ${sequence.data.purpose || '未設定'}\n` +
                  `- 登場キャラクター: ${sequence.data.characters?.join(', ') || '未設定'}\n` +
                  `- キャラクターの内面: このシークエンスでキャラクターはどう変化するか\n` +
                  `- 場面転換: 各シーンの接続をスムーズに\n`
        };
        sequenceFolder.children = [...(sequenceFolder.children || []), sequencePromptFile];
      }
      
      // シーン毎のファイルを作成
      scenes.forEach(scene => {
        // シーンファイルを検索または作成
        const sceneFileName = `${scene.data.title || '無題のシーン'}.md`;
        let sceneFile = sequenceFolder.children?.find(
          item => item.type === 'file' && item.name === sceneFileName
        );
        
        if (!sceneFile) {
          const sceneContent = scene.data.content || '';
          const sceneDescription = scene.data.description || '';
          
          // 起承転結を特定
          let phaseLabel = '';
          if (scene.data.phase === 'ki') phaseLabel = '【起】';
          else if (scene.data.phase === 'sho') phaseLabel = '【承】';
          else if (scene.data.phase === 'ten') phaseLabel = '【転】';
          else if (scene.data.phase === 'ketsu') phaseLabel = '【結】';
          
          const newContent = `# ${phaseLabel}${scene.data.title || '無題のシーン'}\n\n` +
                            `## 概要\n${sceneDescription}\n\n` +
                            `## 登場キャラクター\n${scene.data.characters?.join(', ') || '未設定'}\n\n` +
                            `## 本文\n${sceneContent}\n\n` +
                            `## 読者がページをめくる理由\n` +
                            `- 未来: ${scene.data.futureHook || '未設定'}\n` +
                            `- 過去: ${scene.data.pastHook || '未設定'}\n` +
                            `- 現在: ${scene.data.presentHook || '未設定'}`;
          
          const newSceneFile: FileNode = {
            id: `file-scene-${scene.id}`,
            name: sceneFileName,
            type: 'file',
            content: newContent
          };
          
          sequenceFolder.children = [...(sequenceFolder.children || []), newSceneFile];
        } else if (sceneFile) {
          // 既存のシーンファイルを内容で更新
          const sceneContent = scene.data.content || '';
          if (sceneContent && !String(sceneFile.content).includes(sceneContent)) {
            // 現在の内容を保持しつつ、コンテンツセクションを更新
            const contentSections = String(sceneFile.content).split('## 本文');
            const newContent = contentSections[0] + 
                              `## 本文\n${sceneContent}\n\n` + 
                              (contentSections[1]?.split('## 読者がページをめくる理由')[1] ? 
                               `## 読者がページをめくる理由${contentSections[1].split('## 読者がページをめくる理由')[1]}` : 
                               `## 読者がページをめくる理由\n` +
                               `- 未来: ${scene.data.futureHook || '未設定'}\n` +
                               `- 過去: ${scene.data.pastHook || '未設定'}\n` +
                               `- 現在: ${scene.data.presentHook || '未設定'}`);
            
            sceneFile.content = newContent;
          }
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
  
  // キャラクター執筆プロンプトファイルを追加/更新
  let promptFile = charactersFolder.children?.find(
    item => item.type === 'file' && item.name === '執筆プロンプト.md'
  );
  
  if (!promptFile) {
    promptFile = {
      id: `file-character-prompt`,
      name: '執筆プロンプト.md',
      type: 'file',
      content: createCharacterWritingPrompt(characters)
    };
    charactersFolder.children = [...(charactersFolder.children || []), promptFile];
  } else {
    // 既存のプロンプトファイルを更新
    promptFile.content = createCharacterWritingPrompt(characters);
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
      `- 役割: ${character.role || '未設定'}\n\n` +
      `## キャラクターの目標\n${character.goal || '未設定'}\n\n` +
      `## キャラクターの葛藤\n${character.conflict || '未設定'}\n\n` +
      `## 読者がこのキャラクターに興味を持つ理由\n` +
      `- 未来への興味: ${character.futureHook || '未設定'}\n` +
      `- 過去への興味: ${character.pastHook || '未設定'}\n` +
      `- 現在の状況: ${character.presentHook || '未設定'}`;
    
    if (existingFile) {
      // 既存ファイルの内容を更新
      existingFile.content = content;
    } else {
      // 新規ファイルを作成
      const newFile: FileNode = {
        id: `file-character-${character.id || Date.now().toString()}`,
        name: fileName,
        type: 'file',
        content: content
      };
      
      charactersFolder.children = [...(charactersFolder.children || []), newFile];
    }
  });
  
  // 更新したファイルツリーを保存
  saveFileTree(currentFileTree);
};

// ストーリーノードからファイルの本文を取得
export const getContentFromNode = (nodeId: string, nodes: Node<StoryNodeData>[]): string | null => {
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;
  
  return node.data.content as string || null;
};

// ファイル内容をストーリーノードに反映する
export const updateNodeFromFile = (file: FileNode, nodes: Node<StoryNodeData>[], setNodes: (nodes: Node<StoryNodeData>[]) => void): void => {
  // ファイル名からノードIDを抽出（file-scene-{nodeId}などのパターンを想定）
  const fileIdParts = file.id.split('-');
  if (fileIdParts.length < 3) return;
  
  const nodeType = fileIdParts[1]; // scene, character, etc.
  const nodeId = fileIdParts.slice(2).join('-'); // 残りの部分をIDとして結合
  
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return;
  
  // ファイル内容からノードデータを更新
  if (nodeType === 'scene') {
    // 本文セクションを抽出
    const contentMatch = String(file.content).match(/## 本文\n([\s\S]*?)(\n##|$)/);
    const content = contentMatch ? contentMatch[1].trim() : '';
    
    // 他のメタデータを抽出（必要に応じて）
    const descriptionMatch = String(file.content).match(/## 概要\n([\s\S]*?)(\n##|$)/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';
    
    // ノードを更新
    setNodes(nodes.map(n => {
      if (n.id === nodeId) {
        return {
          ...n,
          data: {
            ...n.data,
            content,
            description
          }
        };
      }
      return n;
    }));
  }
};
