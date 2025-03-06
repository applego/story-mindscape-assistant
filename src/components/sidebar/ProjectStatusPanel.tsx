
import React, { useEffect, useState } from 'react';
import ProjectStatus from '../status/ProjectStatus';
import { Node } from '@xyflow/react';
import { StoryNodeData } from '../flowchart/storyStructureTypes';

// This component will serve as a wrapper that retrieves the nodes data
// and passes it to the ProjectStatus component
const ProjectStatusPanel = () => {
  const [nodes, setNodes] = useState<Node<StoryNodeData>[]>([]);

  useEffect(() => {
    // Load nodes from localStorage
    try {
      const savedFlow = localStorage.getItem('storyflow');
      if (savedFlow) {
        const flow = JSON.parse(savedFlow);
        setNodes(flow.nodes || []);
      }
    } catch (error) {
      console.error('Error loading nodes for project status:', error);
      setNodes([]);
    }

    // Set up event listener for storage changes
    const handleStorageChange = () => {
      try {
        const savedFlow = localStorage.getItem('storyflow');
        if (savedFlow) {
          const flow = JSON.parse(savedFlow);
          setNodes(flow.nodes || []);
        }
      } catch (error) {
        console.error('Error handling storage change:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event listener for local updates (when localStorage is updated in the same window)
    const handleFlowSaved = () => {
      try {
        const savedFlow = localStorage.getItem('storyflow');
        if (savedFlow) {
          const flow = JSON.parse(savedFlow);
          setNodes(flow.nodes || []);
        }
      } catch (error) {
        console.error('Error handling flow saved event:', error);
      }
    };

    window.addEventListener('flowSaved', handleFlowSaved);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('flowSaved', handleFlowSaved);
    };
  }, []);

  return <ProjectStatus nodes={nodes} />;
};

export default ProjectStatusPanel;
