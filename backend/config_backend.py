from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POLICY_FILE = os.path.join(os.path.dirname(__file__), "policy.json")


# 🔹 Função para escrever no arquivo JSON
def write_json(filename: str, data: dict):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


# 🔹 Função para ler um arquivo JSON
def read_json(filename: str, default_data: dict):
    if not os.path.exists(filename):
        return default_data
    with open(filename, "r", encoding="utf-8") as f:
        return json.load(f)


@app.post("/create-policy")
def create_policy(policy_data: dict):
    """Cria ou sobrescreve a política no policy.json"""
    if not policy_data.get("policyTitle"):
        raise HTTPException(status_code=400, detail="O título da política é obrigatório!")

    if not isinstance(policy_data.get("policy"), list):
        raise HTTPException(status_code=400, detail="A política deve conter uma lista de regras!")

    new_policy = {
        "policyTitle": policy_data["policyTitle"],
        "policy": policy_data["policy"],
        "default": policy_data.get("default", 0)
    }

    write_json(POLICY_FILE, new_policy)
    return {"message": "Política criada com sucesso!", "policy": new_policy}


@app.get("/policy")
def get_policy():
    """Retorna a política salva no policy.json"""
    return read_json(POLICY_FILE, {"policyTitle": "Nenhuma política foi criada", "policy": [], "default": 0})


@app.get("/policy/variables")
def get_policy_variables():
    """Retorna apenas as variáveis únicas definidas na política"""
    policy_data = read_json(POLICY_FILE, {"policyTitle": "", "policy": [], "default": 0})
    variables = list(set(rule["variable"] for rule in policy_data.get("policy", [])))
    return {"variables": variables}
