// frontend/src/PolicyForm.tsx

import React, { useState } from "react";
import axios from "axios";

interface Rule {
  variable: string;
  operator: string;
  value: number;
  result: number;
}

const PolicyForm: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [defaultDecision, setDefaultDecision] = useState<number>(0);

  const addRule = () => {
    setRules([...rules, { variable: "", operator: ">", value: 0, result: 0 }]);
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
    try {
      const policy = { policy: rules, default: defaultDecision };
      await axios.post("http://localhost:8000/policy", policy);
      alert("Policy have saved!");
    } catch (error) {
      alert("Error to save policy.");
    }
  };

  return (
    <div>
      <h2>Configure Sua Política</h2>
      {rules.map((rule, index) => (
        <div key={index} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "5px" }}>
          <input
            type="text"
            placeholder="Variable"
            value={rule.variable}
            onChange={(e) => updateRule(index, "variable", e.target.value)}
          />
          <select
            value={rule.operator}
            onChange={(e) => updateRule(index, "operator", e.target.value)}>
            <option value=">">{">"}</option>
            <option value=">=">{">="}</option>
            <option value="<">{"<"}</option>
            <option value="<=">{"<="}</option>
            <option value="=">{"="}</option>
          </select>
          <input
            type="number"
            placeholder="Valor a Comparar"
            value={rule.value}
            onChange={(e) => updateRule(index, "value", Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Resultado (Decisão)"
            value={rule.result}
            onChange={(e) => updateRule(index, "result", Number(e.target.value))}
          />
          <button onClick={() => deleteRule(index)}>Excluir</button>
        </div>
      ))}
      <button onClick={addRule}>Adicionar Regra</button>
      <div style={{ marginTop: "20px" }}>
        <h3>Decisão Default (se nenhuma regra for satisfeita)</h3>
        <input
          type="number"
          value={defaultDecision}
          onChange={(e) => setDefaultDecision(Number(e.target.value))}
        />
      </div>
      <button onClick={savePolicy} style={{ marginTop: "20px" }}>
        Salvar Política
      </button>
    </div>
  );
};

export default PolicyForm;
