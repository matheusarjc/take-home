import React, { useState } from "react";
import axios from "axios";

const DecisionForm: React.FC = () => {
  const [age, setAge] = useState<number | "">("");
  const [income, setIncome] = useState<number | "">("");
  const [decision, setDecision] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8001/execute", {
        age: Number(age),
        income: Number(income),
      });

      setDecision(response.data.decision);
      setError(null);
    } catch (err) {
      setError("Erro ao obter decisão. Verifique a conexão com o backend.");
      setDecision(null);
    }
  };

  return (
    <div>
      <h2>Simulação de Decisão</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Idade:
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")}
            required
          />
        </label>
        <br />
        <label>
          Renda:
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value ? Number(e.target.value) : "")}
            required
          />
        </label>
        <br />
        <button type="submit">Calcular Decisão</button>
      </form>

      {decision !== null && <h3>Decisão: {decision}</h3>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default DecisionForm;
