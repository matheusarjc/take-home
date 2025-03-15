# backend/execution_engine.py

from fastapi import FastAPI, HTTPException
import json
import os

app = FastAPI()

POLICY_FILE = "policy.json"

def evaluate_condition(value, operator, threshold):
    """Função que avalia a condição comparando 'value' com 'threshold' usando 'operator'."""
    if operator == ">":
        return value > threshold
    elif operator == ">=":
        return value >= threshold
    elif operator == "<":
        return value < threshold
    elif operator == "<=":
        return value <= threshold
    elif operator == "=" or operator == "==":
        return value == threshold
    else:
        raise ValueError("Operador inválido")

@app.post("/execute")
def execute_policy(input_data: dict):
    """
    Recebe um JSON com dados (ex: {"age": 23, "income": 3000})
    e executa a política salva para retornar uma decisão.
    """
    if not os.path.exists(POLICY_FILE):
        raise HTTPException(status_code=404, detail="Policy not found")
    
    with open(POLICY_FILE, "r") as f:
        policy_data = json.load(f)

    # Supondo que a política esteja no seguinte formato:
    # {
    #   "policy": [
    #       { "variable": "age", "operator": ">", "value": 18, "result": 1000.0 },
    #       { "variable": "income", "operator": "<", "value": 2000, "result": 500.0 }
    #   ],
    #   "default": 0.0
    # }
    for rule in policy_data.get("policy", []):
        var = rule.get("variable")
        operator = rule.get("operator")
        compare_value = rule.get("value")
        result_value = rule.get("result")
        # Se a variável existir no input
        if var in input_data:
            try:
                # Aqui esperamos que o valor seja numérico
                if evaluate_condition(input_data[var], operator, compare_value):
                    return {"decision": result_value}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
    # Se nenhuma regra for satisfeita, retorna o valor default
    default_value = policy_data.get("default", 0.0)
    return {"decision": default_value}
