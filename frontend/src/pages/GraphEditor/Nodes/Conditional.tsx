// frontend/src/Conditional.tsx
import { DiamondSvg } from "assets/Diamond";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";

export type ConditionalNodeData = {
  label: string;
  elseLabel?: string;
  width: number;
  height: number;
};

export function ConditionalNode({ data }: NodeProps<ConditionalNodeData>) {
  return (
    <NodeWrapper>
      <div
        className="w-full h-full group cursor-pointer"
        style={{
          width: data.width,
          height: data.height,
        }}>
        <div className="p-9 flex items-center justify-center text-[12px] text-center w-full h-full relative z-0">
          <div
            className={`absolute left-0 top-0 w-full h-full text-Y-300 [&>svg]:stroke-Y-600 group-hover:text-Y-350 z-1`}>
            <DiamondSvg strokeWidth={4} />
          </div>
          <Handle
            type="target"
            id="target"
            className="invisible"
            position={Position.Top}
            isConnectable={false}
          />
          <p className="cursor-pointer line-clamp-3 z-10 text-gray-950">{data.label}</p>
          <Handle
            type="source"
            id="source"
            className="invisible"
            position={Position.Bottom}
            isConnectable={false}
          />
        </div>
      </div>
    </NodeWrapper>
  );
}
