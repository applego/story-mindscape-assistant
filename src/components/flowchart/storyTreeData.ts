
import { Edge, Node } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';
import { sampleStoryNodes, sampleStoryEdges } from './sampleStoryData';

export const generateNodeId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

// Export the initial nodes - now they're empty to trigger the flow creation process
export const initialStoryNodes: Node<StoryNodeData>[] = [];
export const initialStoryEdges: Edge[] = [];

// For testing, you can replace the above with:
// export const initialStoryNodes = sampleStoryNodes;
// export const initialStoryEdges = sampleStoryEdges;
