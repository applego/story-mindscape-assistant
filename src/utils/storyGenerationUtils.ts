
import { Node, Edge } from '@xyflow/react';
import { StoryNodeData } from '@/components/flowchart/storyStructureTypes';
import { toast } from 'sonner';

// Author information type
export interface AuthorInfo {
  name: string;
  style: string;
  preferredGenres: string[];
  writingPrompt: string;
}

// Default author information
export const defaultAuthorInfo: AuthorInfo = {
  name: '匿名作家',
  style: '描写的',
  preferredGenres: ['ファンタジー', 'SF', 'ミステリー'],
  writingPrompt: '簡潔かつ明瞭な文体で、情景描写を大切にし、登場人物の心情が伝わるように書いてください。'
};

// Helper function to get all parent nodes of a given node
export const getAllParentNodes = (nodeId: string, nodes: Node<StoryNodeData>[], edges: Edge[]): Node<StoryNodeData>[] => {
  const parentNodes: Node<StoryNodeData>[] = [];
  let currentNodeId = nodeId;
  
  while (true) {
    // Find the edge where the target is the current node
    const edge = edges.find(e => e.target === currentNodeId);
    if (!edge) break;
    
    // Find the parent node
    const parentNode = nodes.find(n => n.id === edge.source);
    if (!parentNode) break;
    
    // Add the parent node to the list and move up the tree
    parentNodes.push(parentNode);
    currentNodeId = parentNode.id;
  }
  
  return parentNodes.reverse(); // Reverse to get from root to the node
};

// Helper function to get all descendant nodes of a given node
export const getAllDescendantNodes = (nodeId: string, nodes: Node<StoryNodeData>[], edges: Edge[]): Node<StoryNodeData>[] => {
  const descendants: Node<StoryNodeData>[] = [];
  const stack: string[] = [nodeId];
  
  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const childEdges = edges.filter(edge => edge.source === currentId);
    
    for (const edge of childEdges) {
      const childNode = nodes.find(n => n.id === edge.target);
      if (childNode) {
        descendants.push(childNode);
        stack.push(childNode.id);
      }
    }
  }
  
  return descendants;
};

// Create a prompt for AI text generation
export const createGenerationPrompt = (node: Node<StoryNodeData>, parentNodes: Node<StoryNodeData>[], authorInfo: AuthorInfo): string => {
  // Type guard to ensure we have StoryNodeData
  if (!node.data) {
    return "エラー: ノードデータが見つかりません。";
  }

  // Get node type in Japanese
  const getNodeTypeJp = (type: string): string => {
    switch (type) {
      case 'story': return 'ストーリー';
      case 'storyline': return 'ストーリーライン';
      case 'sequence': return 'シークエンス';
      case 'scene': return 'シーン';
      case 'action': return 'アクション';
      default: return 'ノード';
    }
  };

  // Base prompt depending on node type
  let basePrompt = '';
  
  switch (node.data.type) {
    case 'story':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というストーリーの全体的な流れを書いてください。`;
      break;
    case 'storyline':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というストーリーラインの展開について詳細に書いてください。`;
      break;
    case 'sequence':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というシークエンスのイベントの流れを書いてください。`;
      break;
    case 'scene':
      basePrompt = `「${node.data.title || 'タイトルなし'}」というシーンの導入部分を書いてください。情景や登場人物の心情が伝わる具体的な描写を入れてください。`;
      break;
    case 'action':
      basePrompt = `「${node.data.title || 'タイトルなし'}」という台詞のシーンを会話形式で書いてください。`;
      break;
    default:
      basePrompt = `以下のノードについて詳細に書いてください。`;
  }
  
  // Add parent node context if available
  if (parentNodes.length > 0) {
    basePrompt += '\n\n前提情報:\n';
    
    parentNodes.forEach((parent, index) => {
      // Check if parent and parent.data exist
      if (parent && parent.data) {
        const nodeTypeLabel = getNodeTypeJp(parent.data.type || '');
        basePrompt += `${index + 1}. ${nodeTypeLabel}: ${parent.data.title || 'タイトルなし'}\n`;
          
        if (parent.data.description) {
          basePrompt += `   説明: ${parent.data.description}\n`;
        }
        
        // Add parent node content if available
        if (parent.data.content) {
          basePrompt += `   内容: ${parent.data.content}\n`;
        }
        
        // Add character information if available
        if (parent.data.characters && parent.data.characters.length > 0) {
          basePrompt += `   登場キャラクター: ${parent.data.characters.join(', ')}\n`;
        }
      }
    });
  }
  
  // Add this node's description if available
  basePrompt += `\nこのノードの説明: ${node.data.description || '説明なし'}\n`;
  
  // Add author information
  basePrompt += `\n作家情報:\n名前: ${authorInfo.name}\nスタイル: ${authorInfo.style}\n好みのジャンル: ${authorInfo.preferredGenres.join(', ')}\n`;
  
  // Add writing style request
  basePrompt += `\n以下の文体で書いてください：\n${authorInfo.writingPrompt}`;
  
  // Log the prompt for debugging
  console.log('文章生成プロンプト:', basePrompt);
  
  return basePrompt;
};

// Simulate AI text generation (will be replaced with actual API call)
export const generateContent = async (prompt: string): Promise<string> => {
  // In a real implementation, this would call an API
  // For now, we'll simulate a delay and return sample text
  return new Promise((resolve) => {
    setTimeout(() => {
      // Sample text generation based on node type detected from prompt
      if (prompt.includes('ストーリー') && prompt.includes('全体的な流れ')) {
        resolve('これは生成されたストーリーの概要です。主人公の旅路と、彼/彼女が直面する様々な試練について語ります。物語は小さな村から始まり、大きな冒険へと広がっていきます。');
      } else if (prompt.includes('ストーリーライン') && prompt.includes('展開')) {
        resolve('このストーリーラインでは、主人公が重要な決断を迫られるシチュエーションが描かれます。内なる葛藤と外からの圧力の中で、キャラクターの成長が見られるでしょう。');
      } else if (prompt.includes('シークエンス') && prompt.includes('イベントの流れ')) {
        resolve('このシークエンスは3つの主要なイベントで構成されています。まず、予期せぬ出会いがあり、次に秘密が明かされ、最後に主人公が重要な決断を下します。各イベントは登場人物の関係性を深める役割を果たします。');
      } else if (prompt.includes('シーン') && prompt.includes('導入部分')) {
        resolve('朝日が窓から差し込む静かな部屋。主人公は眠りから覚め、今日が特別な日であることを思い出します。枕元には昨夜読んでいた古い手紙が置かれています。その手紙が今日の出来事の伏線となるでしょう。');
      } else if (prompt.includes('台詞') && prompt.includes('会話形式')) {
        resolve('「久しぶりだね」と彼は言った。懐かしさと少しの緊張が混じった声色。\n\n「ええ、五年ぶりかしら」彼女は微笑みながら返す。「変わってないわね」\n\n「君も変わっていない」彼は言葉を選びながら答えた。「ただ、もっと…」\n\n「もっと何？」彼女は首を傾げた。\n\n「もっと自信に満ちているように見える」');
      } else {
        resolve('これは生成されたテキストです。ここにはノードの種類や内容に応じた適切な文章が生成されます。実際のAI生成では、より詳細で文脈に沿った内容が提供されるでしょう。');
      }
    }, 1000);
  });
};
