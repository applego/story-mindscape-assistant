
import { FileNode } from '@/components/explorer/FileExplorerView';
import { Character } from './characterData';
import { Node } from '@xyflow/react';
import { StoryNodeData } from '@/components/flowchart/storyStructureTypes';

// ファイルツリーのローカルストレージキー
const STORAGE_KEY = 'storyflow-file-explorer';

// ストーリーフローからファイルノードを生成するヘルパー関数
export const createFileNodeFromStoryNode = (node: Node<StoryNodeData>): FileNode => {
  const nodeData = node.data;
  let fileContent = '';
  let fileName = '';
  
  // ノードタイプに応じたファイル名とコンテンツを設定
  switch (nodeData.type) {
    case 'scene':
      fileName = nodeData.title || 'シーン';
      fileContent = `# ${nodeData.title}\n\n${nodeData.description || ''}\n\n`;
      
      // シーンの詳細情報を追加
      if (nodeData.purpose) {
        fileContent += `## シーンの目的\n${nodeData.purpose}\n\n`;
      }
      
      if (nodeData.setting) {
        fileContent += `## 舞台設定\n${nodeData.setting}\n\n`;
      }
      
      if (nodeData.characters && nodeData.characters.length > 0) {
        fileContent += `## 登場キャラクター\n${nodeData.characters.join(', ')}\n\n`;
      }
      
      // フック情報を追加
      if (nodeData.futureHook) {
        fileContent += `## 未来へのフック（読者がページを捲る理由）\n${nodeData.futureHook}\n\n`;
      }
      
      if (nodeData.pastHook) {
        fileContent += `## 過去へのフック\n${nodeData.pastHook}\n\n`;
      }
      
      if (nodeData.presentHook) {
        fileContent += `## 現在のフック\n${nodeData.presentHook}\n\n`;
      }
      
      // 既存のコンテンツがあれば保持
      if (nodeData.content) {
        fileContent += `## 本文\n${nodeData.content}\n`;
      }
      break;
      
    case 'sequence':
      fileName = nodeData.title || 'シークエンス';
      fileContent = `# ${nodeData.title}\n\n${nodeData.description || ''}\n\n`;
      
      if (nodeData.phase) {
        const phaseMap = {
          ki: '起',
          sho: '承',
          ten: '転',
          ketsu: '結'
        };
        fileContent += `## 物語の段階\n${phaseMap[nodeData.phase]}\n\n`;
      }
      break;
      
    case 'storyline':
      fileName = nodeData.title || 'ストーリーライン';
      fileContent = `# ${nodeData.title}\n\n${nodeData.description || ''}\n\n`;
      break;
      
    default:
      fileName = nodeData.title || 'ノード';
      fileContent = `# ${nodeData.title}\n\n${nodeData.description || ''}\n\n`;
  }
  
  return {
    id: `file-${nodeData.type}-${node.id}`,
    name: `${fileName}.md`,
    type: 'file',
    content: fileContent
  };
};

// ストーリーノードの階層構造をファイルツリーに変換
export const createFileTreeFromNodes = (nodes: Node<StoryNodeData>[]): FileNode[] => {
  // ノードをタイプ別にグループ化
  const storyNodes = nodes.filter(n => n.data.type === 'story');
  const storylineNodes = nodes.filter(n => n.data.type === 'storyline');
  const sequenceNodes = nodes.filter(n => n.data.type === 'sequence');
  const sceneNodes = nodes.filter(n => n.data.type === 'scene');
  const actionNodes = nodes.filter(n => n.data.type === 'action');
  
  // ルートフォルダ構成
  const fileTree: FileNode[] = [
    {
      id: 'folder-story',
      name: 'ストーリー',
      type: 'folder',
      children: []
    },
    {
      id: 'folder-characters',
      name: 'キャラクター',
      type: 'folder',
      children: []
    },
    {
      id: 'folder-settings',
      name: '設定資料',
      type: 'folder',
      children: []
    }
  ];
  
  // ストーリー階層のフォルダとファイルを作成
  if (storyNodes.length > 0) {
    const storyFolder = fileTree.find(f => f.id === 'folder-story');
    if (storyFolder) {
      // 各ストーリーのフォルダを作成
      storyNodes.forEach(storyNode => {
        const storyFiles: FileNode[] = [];
        
        // ストーリーのノートファイル
        storyFiles.push(createFileNodeFromStoryNode(storyNode));
        
        // このストーリーに属するストーリーラインを検索
        const relatedStorylines = storylineNodes.filter(n => 
          n.data.parentId === storyNode.id
        );
        
        // ストーリーラインのサブフォルダを作成
        relatedStorylines.forEach(storylineNode => {
          const storylineFiles: FileNode[] = [];
          
          // ストーリーラインのノートファイル
          storylineFiles.push(createFileNodeFromStoryNode(storylineNode));
          
          // このストーリーラインに属するシークエンスを検索
          const relatedSequences = sequenceNodes.filter(n => 
            n.data.parentId === storylineNode.id
          );
          
          // シークエンスのサブフォルダを作成
          relatedSequences.forEach(sequenceNode => {
            const sequenceFiles: FileNode[] = [];
            
            // シークエンスのノートファイル
            sequenceFiles.push(createFileNodeFromStoryNode(sequenceNode));
            
            // このシークエンスに属するシーンを検索
            const relatedScenes = sceneNodes.filter(n => 
              n.data.parentId === sequenceNode.id
            );
            
            // シーンのファイルを追加
            relatedScenes.forEach(sceneNode => {
              sequenceFiles.push(createFileNodeFromStoryNode(sceneNode));
              
              // このシーンに属するアクションを検索
              const relatedActions = actionNodes.filter(n => 
                n.data.parentId === sceneNode.id
              );
              
              // アクションのファイルがあれば追加
              if (relatedActions.length > 0) {
                const actionFolder: FileNode = {
                  id: `folder-actions-${sceneNode.id}`,
                  name: 'アクション',
                  type: 'folder',
                  children: relatedActions.map(createFileNodeFromStoryNode)
                };
                sequenceFiles.push(actionFolder);
              }
            });
            
            // シークエンスフォルダを追加
            storylineFiles.push({
              id: `folder-sequence-${sequenceNode.id}`,
              name: sequenceNode.data.title || 'シークエンス',
              type: 'folder',
              children: sequenceFiles
            });
          });
          
          // ストーリーラインフォルダを追加
          storyFiles.push({
            id: `folder-storyline-${storylineNode.id}`,
            name: storylineNode.data.title || 'ストーリーライン',
            type: 'folder',
            children: storylineFiles
          });
        });
        
        // ストーリーフォルダを追加
        storyFolder.children?.push({
          id: `folder-story-${storyNode.id}`,
          name: storyNode.data.title || 'ストーリー',
          type: 'folder',
          children: storyFiles
        });
      });
    }
  }
  
  return fileTree;
};

// ファイルツリーから特定のファイルノードを検索する関数
export const findFileNodeById = (tree: FileNode[], fileId: string): FileNode | null => {
  for (const node of tree) {
    if (node.id === fileId) {
      return node;
    }
    
    if (node.children) {
      const found = findFileNodeById(node.children, fileId);
      if (found) {
        return found;
      }
    }
  }
  
  return null;
};

// ファイルコンテンツからノードIDを抽出する関数
export const extractNodeIdFromFileId = (fileId: string): string | null => {
  // file-scene-node123 から node123 を抽出
  const match = fileId.match(/file-(story|storyline|sequence|scene|action)-(.+)/);
  return match ? match[2] : null;
};

// ファイルコンテンツからノードデータを更新する関数
export const updateNodeFromFile = (
  file: FileNode, 
  nodes: Node<StoryNodeData>[], 
  callback: (updatedNodes: Node<StoryNodeData>[]) => void
) => {
  const nodeId = extractNodeIdFromFileId(file.id);
  if (!nodeId) return;
  
  const updatedNodes = [...nodes];
  const nodeIndex = updatedNodes.findIndex(n => n.id === nodeId);
  
  if (nodeIndex === -1) return;
  
  // ファイルの内容から情報を抽出
  const fileContent = file.content || '';
  
  // タイトルを抽出（# で始まる行）
  const titleMatch = fileContent.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  // 説明を抽出（タイトルの次の行から次の ## までか末尾まで）
  let descriptionMatch = fileContent.split(/^#\s+.+$/m)[1];
  if (descriptionMatch) {
    descriptionMatch = descriptionMatch.split(/^##/m)[0].trim();
  }
  const description = descriptionMatch || '';
  
  // その他のフィールドを抽出
  const purposeMatch = fileContent.match(/^##\s+シーンの目的\s*\n([\s\S]*?)(?=\n##|\n$|$)/m);
  const purpose = purposeMatch ? purposeMatch[1].trim() : undefined;
  
  const settingMatch = fileContent.match(/^##\s+舞台設定\s*\n([\s\S]*?)(?=\n##|\n$|$)/m);
  const setting = settingMatch ? settingMatch[1].trim() : undefined;
  
  const charactersMatch = fileContent.match(/^##\s+登場キャラクター\s*\n([\s\S]*?)(?=\n##|\n$|$)/m);
  const characters = charactersMatch 
    ? charactersMatch[1].trim().split(',').map(c => c.trim()) 
    : undefined;
  
  const futureHookMatch = fileContent.match(/^##\s+未来へのフック.*\n([\s\S]*?)(?=\n##|\n$|$)/m);
  const futureHook = futureHookMatch ? futureHookMatch[1].trim() : undefined;
  
  const pastHookMatch = fileContent.match(/^##\s+過去へのフック\s*\n([\s\S]*?)(?=\n##|\n$|$)/m);
  const pastHook = pastHookMatch ? pastHookMatch[1].trim() : undefined;
  
  const presentHookMatch = fileContent.match(/^##\s+現在のフック\s*\n([\s\S]*?)(?=\n##|\n$|$)/m);
  const presentHook = presentHookMatch ? presentHookMatch[1].trim() : undefined;
  
  const contentMatch = fileContent.match(/^##\s+本文\s*\n([\s\S]*?)(?=\n##|\n$|$)/m);
  const content = contentMatch ? contentMatch[1].trim() : undefined;
  
  // ノードを更新
  updatedNodes[nodeIndex] = {
    ...updatedNodes[nodeIndex],
    data: {
      ...updatedNodes[nodeIndex].data,
      title: title || updatedNodes[nodeIndex].data.title,
      description: description || updatedNodes[nodeIndex].data.description,
      purpose,
      setting,
      characters,
      futureHook,
      pastHook,
      presentHook,
      content
    }
  };
  
  callback(updatedNodes);
};

// ストーリーフローノードの変更をファイルツリーと同期する
export const syncPlotNodesToFileTree = (nodes: Node<StoryNodeData>[]) => {
  // 既存のファイルツリーを取得
  const existingTree = getFileTree();
  
  // 新しいファイルツリーを生成
  const newNodes = createFileTreeFromNodes(nodes);
  
  // キャラクターフォルダの内容は保持
  const characterFolder = existingTree.find(f => f.id === 'folder-characters');
  if (characterFolder && characterFolder.children) {
    const newCharacterFolder = newNodes.find(f => f.id === 'folder-characters');
    if (newCharacterFolder) {
      newCharacterFolder.children = characterFolder.children;
    }
  }
  
  // 設定資料フォルダの内容は保持
  const settingsFolder = existingTree.find(f => f.id === 'folder-settings');
  if (settingsFolder && settingsFolder.children) {
    const newSettingsFolder = newNodes.find(f => f.id === 'folder-settings');
    if (newSettingsFolder) {
      newSettingsFolder.children = settingsFolder.children;
    }
  }
  
  // 更新されたファイルツリーを保存
  saveFileTree(newNodes);
};

// キャラクターフォルダにキャラクターファイルを追加
export const addCharacterToFileTree = (character: Character) => {
  const fileTree = getFileTree();
  const characterFolder = fileTree.find(f => f.id === 'folder-characters');
  
  if (characterFolder) {
    // キャラクターの詳細情報をMarkdown形式で作成
    const content = `# ${character.name}\n\n` +
      `## 性格\n${character.personality}\n\n` +
      `## 強み（長所）\n${character.strengths}\n\n` +
      `## 弱み（短所）\n${character.weaknesses}\n\n` +
      `## 背景\n${character.background}\n\n` +
      `## 役割\n${character.role}\n\n` +
      (character.goal ? `## 目標\n${character.goal}\n\n` : '') +
      (character.conflict ? `## 葛藤\n${character.conflict}\n\n` : '') +
      (character.futureHook ? `## 未来へのフック\n${character.futureHook}\n\n` : '') +
      (character.pastHook ? `## 過去へのフック\n${character.pastHook}\n\n` : '') +
      (character.presentHook ? `## 現在へのフック\n${character.presentHook}\n\n` : '');
    
    // 関係性の情報があれば追加
    if (character.relationships && character.relationships.length > 0) {
      let relationshipsContent = `## 関係性\n\n`;
      
      character.relationships.forEach(rel => {
        relationshipsContent += `- **${rel.targetId}**: ${rel.type} - ${rel.description}\n`;
      });
      
      content += relationshipsContent;
    }
    
    // キャラクターファイルを作成
    const characterFile: FileNode = {
      id: `file-character-${character.id}`,
      name: `${character.name}.md`,
      type: 'file',
      content
    };
    
    // 既存のファイルがあるか確認して更新または追加
    const existingIndex = characterFolder.children?.findIndex(c => 
      c.id === `file-character-${character.id}`
    );
    
    if (existingIndex !== undefined && existingIndex >= 0 && characterFolder.children) {
      characterFolder.children[existingIndex] = characterFile;
    } else {
      characterFolder.children = [
        ...(characterFolder.children || []),
        characterFile
      ];
    }
    
    // 変更を保存
    saveFileTree(fileTree);
  }
};

// 初期のファイルツリーを作成
export const createInitialFileTree = (): FileNode[] => {
  return [
    {
      id: 'folder-story',
      name: 'ストーリー',
      type: 'folder',
      children: [
        {
          id: 'file-story-notes',
          name: 'ストーリーノート.md',
          type: 'file',
          content: '# ストーリーノート\n\nここにストーリー全体のメモやアイデアを書き留めておくことができます。'
        }
      ]
    },
    {
      id: 'folder-characters',
      name: 'キャラクター',
      type: 'folder',
      children: []
    },
    {
      id: 'folder-settings',
      name: '設定資料',
      type: 'folder',
      children: [
        {
          id: 'file-world-building',
          name: '世界観設定.md',
          type: 'file',
          content: '# 世界観設定\n\nここに物語の世界観や背景設定について詳しく書くことができます。'
        }
      ]
    }
  ];
};

// ファイルツリーの取得（ローカルストレージから）
export const getFileTree = (): FileNode[] => {
  try {
    const savedTree = localStorage.getItem(STORAGE_KEY);
    if (savedTree) {
      return JSON.parse(savedTree);
    }
  } catch (error) {
    console.error('Error loading file tree:', error);
  }
  
  // 保存されたデータがなければ初期ツリーを作成
  const initialTree = createInitialFileTree();
  saveFileTree(initialTree);
  return initialTree;
};

// ファイルツリーの保存（ローカルストレージへ）
export const saveFileTree = (fileTree: FileNode[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fileTree));
  } catch (error) {
    console.error('Error saving file tree:', error);
  }
};
