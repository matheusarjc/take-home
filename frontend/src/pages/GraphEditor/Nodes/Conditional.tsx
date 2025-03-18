import { useState, useEffect } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { NodeWrapper } from "./NodeWrapper";
import { DiamondSvg } from "assets/Diamond";
import axios from "axios";

export type ConditionalNodeData = {
  label: string;
  variable?: string;
  operator?: string;
  value?: number;
  width: number;
  height: number;
};

export type PolicyRule = {
  variable: string;
  operator: ">" | ">=" | "<" | "<=" | "=";
  value: number;
  decision: number;
};

export type PolicyData = {
  policyTitle: string;
  policy: PolicyRule[];
  default: number;
};

export function ConditionalNode({ id, data }: NodeProps<ConditionalNodeData>) {
  const [isEditing, setIsEditing] = useState(false);
  const [variable, setVariable] = useState<string>(data.variable || "");
  const [operator, setOperator] = useState<string>(data.operator || ">");
  const [value, setValue] = useState<number>(data.value || 0);
  const [decision, setDecision] = useState<number | null>(null);
  const [policyTitle, setPolicyTitle] = useState<string>("");
  const [availableVariables, setAvailableVariables] = useState<string[]>([]);

  // 🔹 Buscar as variáveis únicas da política ao montar o componente
  useEffect(() => {
    axios
      .get("http://localhost:8000/policy")
      .then((response) => {
        console.log(response.data);

        setPolicyTitle(response.data.policyTitle);

        // Extrair variáveis únicas do policy.json
        const uniqueVariables = Array.from(
          new Set(response.data.policy.map((rule: PolicyRule) => rule.variable))
        ) as string[];
        setAvailableVariables(uniqueVariables);

        // Verifica se a variável escolhida tem um valor de decisão associado
        const policy = response.data.policy.find((rule: PolicyRule) => rule.variable === variable);
        if (policy) {
          setDecision(policy.result);
          setValue(policy.value); // Definir o valor automaticamente baseado na política
        }
      })
      .catch((error) => console.error("Erro ao carregar política:", error));
  }, [variable]);

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <NodeWrapper>
      <div
        className="w-full h-full group cursor-pointer relative"
        style={{ width: data.width, height: data.height }}
        onClick={() => setIsEditing(true)}>
        {/* Ícone do Diamante */}
        <div className="absolute left-0 top-0 w-full h-full text-yellow-400 [&>svg]:stroke-yellow-600 group-hover:text-yellow-500 z-0">
          <DiamondSvg strokeWidth={4} />
        </div>

        {/* Informação da Condicional */}
        <div className="p-9 flex flex-col items-center justify-center text-[12px] text-center w-full h-full relative z-10">
          <p className="font-semibold">
            {variable ? `${variable} ${operator} ${value}` : "Click to config"}
          </p>
          {decision !== null && (
            <p className="text-xs text-gray-700 mt-1">
              {variable}: {decision}
            </p>
          )}
        </div>
        {/* Handles para conexão */}
        <Handle
          type="target"
          id="target"
          className="invisible"
          position={Position.Top}
          isConnectable
        />
        <Handle
          type="source"
          id="source"
          className="invisible"
          position={Position.Bottom}
          isConnectable
        />
      </div>

      {/* Modal para Configuração */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-2">Verify your condition</h2>

            {/* Escolher variável (dinâmica do policy.json) */}
            <label className="block text-sm font-medium text-gray-700">Variable</label>
            <select
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="border p-2 rounded w-full mb-2">
              <option value="">Selecione...</option>
              {availableVariables.map((varName) => (
                <option key={varName} value={varName}>
                  {varName}
                </option>
              ))}
            </select>

            {/* Input dinâmico baseado na variável escolhida */}
            {variable === "Age" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => {
                    setValue(Number(e.target.value));
                  }}
                  className="border p-2 rounded w-full mb-2"
                  placeholder="Digite a idade"
                />
              </div>
            )}

            {variable === "Income" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Income</label>
                <input
                  type="text"
                  value={new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(value)}
                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/\D/g, ""); // Remove caracteres não numéricos
                    const newValue = Number(rawValue) / 100; // Divide por 100 para formatar centavos
                    setValue(newValue);
                  }}
                  className="border p-2 rounded w-full mb-2"
                  placeholder="Digite o salário"
                />
              </div>
            )}

            {/* Botões de ação */}
            <div className="flex justify-between">
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-500 text-white px-3 py-1 rounded">
                Cancelar
              </button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-3 py-1 rounded">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </NodeWrapper>
  );
}
