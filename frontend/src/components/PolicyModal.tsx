import React, { useState } from "react";
import axios from "axios";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Rule {
  variable: string;
  operator: string;
  value: number;
  decision: number;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
  const [policyTitle, setPolicyTitle] = useState<string>("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [defaultDecision, setDefaultDecision] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const addRule = () => {
    setRules([...rules, { variable: "", operator: ">", value: 0, decision: 0 }]);
  };

  const updateRule = <K extends keyof Rule>(index: number, field: K, value: Rule[K]) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    setRules(newRules);
  };

  const deleteRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const savePolicy = async () => {
    if (!policyTitle.trim()) {
      setMessage("O título da política é obrigatório!");
      return;
    }

    try {
      const policy = { policyTitle, policy: rules, default: defaultDecision };
      const response = await axios.post("http://localhost:8000/create-policy", policy);
      setMessage(response.data.message);
      setTimeout(() => {
        setMessage(null);
        onClose();
      }, 2000);
    } catch (error: any) {
      setMessage(error.response?.data?.detail || "Erro ao salvar política.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-2">Criar Nova Política</h2>

        {/* Nome da Política */}
        <input
          type="text"
          placeholder="Título da Política"
          value={policyTitle}
          onChange={(e) => setPolicyTitle(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />

        {/* Regras */}
        {rules.map((rule, index) => (
          <div key={index} className="border p-2 rounded mb-2">
            <input
              type="text"
              placeholder="Variável"
              value={rule.variable}
              onChange={(e) => updateRule(index, "variable", e.target.value)}
              className="border p-1 rounded mr-2"
            />
            <select
              value={rule.operator}
              onChange={(e) => updateRule(index, "operator", e.target.value)}
              className="border p-1 rounded mr-2">
              <option value=">">{">"}</option>
              <option value=">=">{">="}</option>
              <option value="<">{"<"}</option>
              <option value="<=">{"<="}</option>
              <option value="=">{"="}</option>
            </select>
            <input
              type="number"
              placeholder="Valor"
              value={rule.value}
              onChange={(e) => updateRule(index, "value", Number(e.target.value))}
              className="border p-1 rounded mr-2"
            />
            <input
              type="number"
              placeholder="Decisão"
              value={rule.decision}
              onChange={(e) => updateRule(index, "decision", Number(e.target.value))}
              className="border p-1 rounded mr-2"
            />
            <button onClick={() => deleteRule(index)} className="text-red-600 ml-2">
              🗑
            </button>
          </div>
        ))}
        <button onClick={addRule} className="bg-gray-700 text-white px-2 py-1 rounded">
          Adicionar Regra
        </button>

        {/* Decisão Padrão */}
        <div className="mt-4">
          <h3>Decisão Default</h3>
          <input
            type="number"
            value={defaultDecision}
            onChange={(e) => setDefaultDecision(Number(e.target.value))}
            className="border p-1 rounded w-full"
          />
        </div>

        {/* Botões de Ação */}
        <div className="mt-4 flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white px-3 py-1 rounded">
            Cancelar
          </button>
          <button onClick={savePolicy} className="bg-blue-600 text-white px-3 py-1 rounded">
            Salvar
          </button>
        </div>

        {message && <p className="text-green-600 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default PolicyModal;
