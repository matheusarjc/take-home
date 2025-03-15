# backend/execution_engine.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique as origens permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define o caminho absoluto para policy.json
POLICY_FILE = os.path.join(os.path.dirname(__file__), "policy.json")

def evaluate_condition(value, operator, threshold):
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
    if not os.path.exists(POLICY_FILE):
        raise HTTPException(status_code=404, detail="Policy not found")
    
    with open(POLICY_FILE, "r") as f:
        policy_data = json.load(f)

    for rule in policy_data.get("policy", []):
        var = rule.get("variable")
        operator = rule.get("operator")
        compare_value = rule.get("value")
        result_value = rule.get("result")
        if var in input_data:
            try:
                if evaluate_condition(input_data[var], operator, compare_value):
                    return {"decision": result_value}
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
    default_value = policy_data.get("default", 0.0)
    return {"decision": default_value}
