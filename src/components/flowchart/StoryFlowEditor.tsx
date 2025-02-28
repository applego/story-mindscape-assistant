
import { useState, useCallback, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  Connection,
  Edge,
  NodeTypes,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  MarkerType,
  ReactFlowProvider,
  NodeDragHandler,
  Node
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import StoryNode from "./nodes/StoryNode";
import StoryNodeMenu from "./StoryNodeMenu";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { generateNodeId, initialNodes, initialEdges } from "./storyFlowData";

const nodeTypes: NodeTypes = {
  storyNode: StoryNode,
};

const StoryFlowEditor = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => 
      addEdge({ 
        ...params, 
        animated: true,
        style: { strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed }
      }, eds)
    );
  }, [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow/type");
      const phaseType = event.dataTransfer.getData("application/reactflow/phase");

      if (!reactFlowBounds || !type || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: generateNodeId(),
        type,
        position,
        data: { 
          label: `${phaseType} ノード`, 
          description: "ここをクリックして編集",
          phase: phaseType
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    // If we're dragging a node, we want to hide the panel
    setSelectedNode(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onNodeDragStart={onNodeDragStart}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls />
          <Background gap={16} size={1} />
          
          <Panel position="top-left" className="bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm border border-gray-200 animate-fade-in">
            <div className="font-medium mb-2 text-sm text-gray-700">ストーリー要素を追加</div>
            <StoryNodeMenu />
          </Panel>
          
          <Panel position="bottom-right" className="m-6">
            <Button size="sm" className="rounded-full shadow-md">
              <Plus size={16} className="mr-1" />
              新規ノード
            </Button>
          </Panel>
        </ReactFlow>
      </ReactFlowProvider>
      
      {selectedNode && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] max-w-full mb-6 bg-white/90 backdrop-blur-md shadow-lg border border-gray-200 rounded-lg p-4 animate-slide-in">
          <h3 className="font-medium mb-2">{selectedNode.data.label}</h3>
          <textarea
            className="w-full h-24 p-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            defaultValue={selectedNode.data.description}
            placeholder="このシーンの詳細を入力..."
            onChange={(e) => {
              setNodes((nds) =>
                nds.map((node) => {
                  if (node.id === selectedNode.id) {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        description: e.target.value,
                      },
                    };
                  }
                  return node;
                })
              );
            }}
          />
        </div>
      )}
    </div>
  );
};

export default StoryFlowEditor;
