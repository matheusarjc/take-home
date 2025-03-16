import "reactflow/dist/style.css";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactFlow, { Background } from "reactflow";
import { AddNodeEdge } from "./AddNodeEdge";
import { CurrentDrawer } from "./Drawers";
import { EditorProvider, DrawerName, editor } from "./Editor";
import { GraphProvider, graph } from "./Graph";
import { allNodes } from "./Nodes";
import { generateEdge, generateNode } from "./nodeGeneration";
import { positionNodes } from "./positionNodes";

const edgeTypes = {
  "add-node": AddNodeEdge,
};

function ReactFlowSandbox() {
  const {
    nodes,
    edges,
    reactFlowInstance,
    setReactFlowInstance,
    fitZoomToGraph,
    setNodes,
    setEdges,
  } = useContext(graph);

  // Obtemos a função para abrir drawers a partir do contexto do Editor
  const { showDrawer } = useContext(editor);

  const [centeredGraphAtStart, setCenteredGraphAtStart] = useState(false);
  const reactFlowRef = useRef<HTMLDivElement>(null);

  const tryCenteringGraph = useCallback(() => {
    if (centeredGraphAtStart) {
      return;
    }

    fitZoomToGraph(reactFlowRef);

    const viewport = reactFlowInstance?.getViewport();
    if (viewport && viewport.x !== 0 && viewport.y !== 0) {
      return setCenteredGraphAtStart(true);
    }

    const retryTimeInMs = 50;
    setTimeout(() => tryCenteringGraph(), retryTimeInMs);
  }, [centeredGraphAtStart, fitZoomToGraph, reactFlowInstance]);

  useEffect(() => {
    tryCenteringGraph();
  }, [tryCenteringGraph]);

  useEffect(() => {
    const initialNodes = [
      generateNode({ nodeName: "start", id: "start" }),
      generateNode({ nodeName: "end" }),
    ];
    const initialEdges = [
      generateEdge({
        source: "start",
        target: initialNodes[1].id,
      }),
    ];
    const [positionedNodes, positionedEdges] = positionNodes(initialNodes, initialEdges);
    setNodes(positionedNodes);
    setEdges(positionedEdges);
  }, [setNodes, setEdges]);

  return (
    <div className="h-full flex flex-col overflow-hidden w-full relative">
      <ReactFlow
        ref={reactFlowRef}
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        nodeTypes={allNodes}
        onInit={setReactFlowInstance}
        nodesDraggable={false}
        deleteKeyCode={null}>
        <Background className="bg-N-75" size={2} color="#C1C4D6" />
      </ReactFlow>
      {/* Botão para abrir o drawer de política */}
      <button
        style={{
          position: "absolute",
          bottom: 0,
          right: 20,
          zIndex: 100,
          padding: "8px 16px",
          background: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => showDrawer(DrawerName.policy, { id: "policyDrawer" })}>
        Configurar Política
      </button>
      <CurrentDrawer />
    </div>
  );
}

export function GraphEditor() {
  return (
    <EditorProvider>
      <GraphProvider>
        <ReactFlowSandbox />
      </GraphProvider>
    </EditorProvider>
  );
}
