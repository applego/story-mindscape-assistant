
import { Edge, Node } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';
import { sampleStoryNodes, sampleStoryEdges } from './sampleStoryData';

export const generateNodeId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

// ユニークなタイムポジションを生成する関数
export const generateTimePosition = (nodes: Node<StoryNodeData>[], type: string) => {
  const existingNodes = nodes.filter(n => n.data.type === type);
  const maxPosition = existingNodes.reduce((max, node) => {
    const pos = typeof node.data.timePosition === 'number' ? node.data.timePosition : 0;
    return pos > max ? pos : max;
  }, 0);
  
  return maxPosition + 10; // 10刻みで新しい位置を割り当て
};

// Export the initial nodes - using sample data to populate the timeline view
export const initialStoryNodes: Node<StoryNodeData>[] = sampleStoryNodes;
export const initialStoryEdges: Edge[] = sampleStoryEdges;

// For testing, you can replace the above with empty arrays:
// export const initialStoryNodes: Node<StoryNodeData>[] = [];
// export const initialStoryEdges: Edge[] = [];

// Helper function to count node types
export const countNodeTypes = (nodes: Node<StoryNodeData>[]) => {
  const counts = {
    story: 0,
    storyline: 0,
    sequence: 0,
    scene: 0,
    action: 0,
    total: 0
  };
  
  nodes.forEach(node => {
    if (node.data.type && counts.hasOwnProperty(node.data.type)) {
      counts[node.data.type as keyof typeof counts] += 1;
      counts.total += 1;
    }
  });
  
  return counts;
};

// Custom event to notify that flow has been saved
export const dispatchFlowSavedEvent = () => {
  const event = new Event('flowSaved');
  window.dispatchEvent(event);
};
