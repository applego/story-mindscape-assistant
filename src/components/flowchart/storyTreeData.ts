
import { Edge, Node } from '@xyflow/react';
import { StoryNodeData } from './storyStructureTypes';
import { sampleStoryNodes, sampleStoryEdges } from './sampleStoryData';

export const generateNodeId = () => `node_${Math.random().toString(36).substr(2, 9)}`;

// Export the initial nodes - using sample data to populate the timeline view
export const initialStoryNodes: Node<StoryNodeData>[] = sampleStoryNodes;
export const initialStoryEdges: Edge[] = sampleStoryEdges;

// For testing, you can replace the above with empty arrays:
// export const initialStoryNodes: Node<StoryNodeData>[] = [];
// export const initialStoryEdges: Edge[] = [];
