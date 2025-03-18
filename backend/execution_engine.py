from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils import read_json, write_json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POLICY_FILE = os.path.join(os.path.dirname(__file__), "policy.json")
RESULTS_FILE = os.path.join(os.path.dirname(__file__), "results.json")

def evaluate_condition(value, operator, threshold):
    """Avalia uma condição matemática com base na política"""
    operators = {
        ">": lambda x, y: x > y,
        ">=": lambda x, y: x >= y,
        "<": lambda x, y: x < y,
        "<=": lambda x, y: x <= y,
        "=": lambda x, y: x == y,
        "==": lambda x, y: x == y,
    }
    if operator in operators:
        return operators[operator](value, threshold)
    raise ValueError(f"Operador inválido: {operator}")

@app.post("/execute")
def execute_policy(input_data: dict):
    """Executa a política baseada nos dados recebidos e cria policy.json se não existir"""
    policy_data = read_json(POLICY_FILE, None)

    # Se não houver política, cria uma padrão automaticamente
    if policy_data is None:
        policy_data = {
            "policyTitle": "Default Policy",
            "policy": [],
            "default": 0
        }
        write_json(POLICY_FILE, policy_data)

    if not policy_data["policy"]:
        raise HTTPException(status_code=404, detail="Nenhuma política configurada")

    for rule in policy_data["policy"]:
        var, operator, compare_value, result_value = rule["variable"], rule["operator"], rule["value"], rule["result"]
        if var in input_data:
            try:
                if evaluate_condition(input_data[var], operator, compare_value):
                    decision = {"policyTitle": policy_data["policyTitle"], "decision": result_value, "input": input_data}
                    save_decision(decision)
                    return decision
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))

    # Se nenhuma condição for atendida, usa o valor default
    decision = {"policyTitle": policy_data["policyTitle"], "decision": policy_data["default"], "input": input_data}
    save_decision(decision)
    return decision

def save_decision(decision_data):
    """Salva os resultados das decisões em um arquivo JSON"""
    results = read_json(RESULTS_FILE, [])
    results.append(decision_data)
    write_json(RESULTS_FILE, results)

@app.get("/results")
def get_results():
    """Retorna todas as decisões salvas"""
    return read_json(RESULTS_FILE, [])
