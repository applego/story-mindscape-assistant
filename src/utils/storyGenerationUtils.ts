import { Node } from '@xyflow/react';
import { StoryNodeData } from '@/components/flowchart/storyStructureTypes';
import { toast } from 'sonner';

/**
 * 文章生成AIのプロンプトを作成するための関数
 */
export const createGenerationPrompt = (
  node: Node<StoryNodeData>, 
  parentNodes: Node<StoryNodeData>[], 
  authorInfo: AuthorInfo
): string => {
  // ノードタイプに応じたプロンプトの基本形を作成
  let basePrompt = '';
  
  switch (node.data.type) {
    case 'story':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というタイトルのストーリーの全体的な概要を書いてください。`;
      break;
    case 'storyline':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というストーリーラインの展開について詳細に書いてください。`;
      break;
    case 'sequence':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というシークエンスのイベントの流れを書いてください。`;
      break;
    case 'scene':
      const phaseText = getPhaseText(node.data.phase);
      basePrompt = `「${node.data.title || 'タイトルなし'}」というシーンの${phaseText}を書いてください。情景や登場人物の心情が伝わる具体的な描写を入れてください。`;
      break;
    case 'action':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というアクションの詳細な描写を書いてください。`;
      if (node.data.actionType === 'dialogue') {
        basePrompt = `「${node.data.title || 'タイトルなし'}」という台詞のシーンを会話形式で書いてください。`;
      } else if (node.data.actionType === 'thought') {
        basePrompt = `「${node.data.title || 'タイトルなし'}」という思考の内容を内的独白として書いてください。`;
      }
      break;
    default:
      basePrompt = `「${node.data.title || 'タイトルなし'}」の内容を書いてください。`;
  }
  
  // 親ノードからの情報を追加
  if (parentNodes.length > 0) {
    basePrompt += '\n\n前提情報:\n';
    
    parentNodes.forEach((parent, index) => {
      basePrompt += `${index + 1}. ${parent.data.type === 'story' ? 'ストーリー' : 
        parent.data.type === 'storyline' ? 'ストーリーライン' : 
        parent.data.type === 'sequence' ? 'シークエンス' : 
        parent.data.type === 'scene' ? 'シーン' : 'アクション'}: ${parent.data.title || 'タイトルなし'}\n`;
        
      if (parent.data.description) {
        basePrompt += `   説明: ${parent.data.description}\n`;
      }
      
      // 親ノードのコンテンツ情報があれば追加
      if (parent.data.content) {
        basePrompt += `   内容: ${parent.data.content}\n`;
      }
      
      // キャラクター情報があれば追加
      if (parent.data.characters && parent.data.characters.length > 0) {
        basePrompt += `   登場キャラクター: ${parent.data.characters.join(', ')}\n`;
      }
    });
  }
  
  // 現在のノードの追加情報
  if (node.data.description) {
    basePrompt += `\nこのノードの説明: ${node.data.description}\n`;
  }
  
  // キャラクター情報があれば追加
  if (node.data.characters && node.data.characters.length > 0) {
    basePrompt += `\n登場キャラクター: ${node.data.characters.join(', ')}\n`;
  }
  
  // 作家情報を追加
  basePrompt += `\n作家情報:\n`;
  basePrompt += `名前: ${authorInfo.name}\n`;
  basePrompt += `スタイル: ${authorInfo.style}\n`;
  basePrompt += `好みのジャンル: ${authorInfo.preferredGenres.join(', ')}\n`;
  
  // 文体の指示
  basePrompt += `\n以下の文体で書いてください：\n${authorInfo.writingStyle}\n`;
  
  return basePrompt;
};

/**
 * 物語の局面（起承転結）のテキストを取得
 */
const getPhaseText = (phase?: string): string => {
  switch (phase) {
    case 'ki': return '導入部分';
    case 'sho': return '展開部分';
    case 'ten': return '転換部分';
    case 'ketsu': return '結末部分';
    default: return '内容';
  }
};

/**
 * 作家の情報を表す型
 */
export interface AuthorInfo {
  name: string;
  style: string;
  preferredGenres: string[];
  writingStyle: string;
}

/**
 * サンプルの作家情報
 */
export const defaultAuthorInfo: AuthorInfo = {
  name: "匿名作家",
  style: "描写的",
  preferredGenres: ["ファンタジー", "SF", "ミステリー"],
  writingStyle: "簡潔かつ明瞭な文体で、情景描写を大切にし、登場人物の心情が伝わるように書いてください。"
};

/**
 * 指定されたノードの親ノードを全て取得
 */
export const getAllParentNodes = (
  nodeId: string,
  nodes: Node<StoryNodeData>[],
  edges: any[]
): Node<StoryNodeData>[] => {
  const parentNodes: Node<StoryNodeData>[] = [];
  let currentNodeId = nodeId;
  
  // 親ノードを辿って配列に追加
  while (currentNodeId) {
    // 親エッジを検索
    const parentEdge = edges.find(edge => edge.target === currentNodeId);
    
    if (!parentEdge) break;
    
    // 親ノードを検索
    const parentNode = nodes.find(node => node.id === parentEdge.source);
    
    if (!parentNode) break;
    
    // 親ノードを配列に追加
    parentNodes.unshift(parentNode);
    
    // 次の親ノードへ
    currentNodeId = parentEdge.source;
  }
  
  return parentNodes;
};

/**
 * 指定されたノードの全ての子孫ノードを取得
 */
export const getAllDescendantNodes = (
  nodeId: string,
  nodes: Node<StoryNodeData>[],
  edges: any[]
): Node<StoryNodeData>[] => {
  const descendants: Node<StoryNodeData>[] = [];
  const queue: string[] = [nodeId];
  
  while (queue.length > 0) {
    const currentId = queue.shift()!;
    
    // 子エッジを検索
    const childEdges = edges.filter(edge => edge.source === currentId);
    
    for (const edge of childEdges) {
      const childNode = nodes.find(node => node.id === edge.target);
      
      if (childNode) {
        descendants.push(childNode);
        queue.push(childNode.id);
      }
    }
  }
  
  return descendants;
};

/**
 * AIを使って文章を生成する（モックとして簡単な実装）
 */
export const generateContent = async (prompt: string): Promise<string> => {
  // 実際のAI APIを呼び出す代わりにモックの生成処理
  console.log("文章生成プロンプト:", prompt);
  
  // ノードタイプに応じたサンプル文章を返す簡易的な実装
  // 実際の実装ではOpenAI APIなどを使用
  return new Promise(resolve => {
    setTimeout(() => {
      if (prompt.includes('シーン')) {
        resolve(`室内に差し込む柔らかな光が壁に映る影を作り出していた。窓辺に立つ彼女の横顔は、物思いに沈んでいるようにも見えた。「どうしてこんなことになってしまったのだろう」と彼女は呟いた。それは誰に向けた言葉でもなく、ただ風に乗せる思いだった。`);
      } else if (prompt.includes('アクション')) {
        resolve(`彼は素早く身を翻すと、目の前の障害物を一気に飛び越えた。着地の衝撃を足首で吸収しながら、すぐに次の動きへと移る。その一連の動作は長年の訓練の賜物だった。`);
      } else if (prompt.includes('台詞')) {
        resolve(`「本当にそれでいいの？」と彼女は静かに尋ねた。\n「わからない。でも、今はこれしかないんだ」と彼は視線を落としながら答えた。\n「じゃあ、私も一緒に行くわ」\n「危険だ」\n「だからこそ」`);
      } else {
        resolve(`物語は静かな田舎町から始まる。誰もが互いを知り、秘密など存在しないと思われていた場所。しかし、ある夏の日、町はずれの古い井戸から奇妙な光が放たれ、それが全ての始まりとなった。`);
      }
    }, 1000);
  });
};
