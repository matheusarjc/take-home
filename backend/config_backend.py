from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from utils import write_json, read_json
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

@app.post("/create-policy")
def create_policy(policy_data: dict):
    """Cria ou sobrescreve a política no policy.json corretamente."""
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
    return {"message": "Policy have been created!", "policy": new_policy}

@app.get("/policy")
def get_policy():
    """Retorna a política salva no policy.json"""
    return read_json(POLICY_FILE, {"policyTitle": "Any policy have been created", "policy": [], "default": 0})

@app.get("/policy/variables")
def get_policy_variables():
    return read_json(POLICY_FILE, {"policyTitle": "Any policy have been created", "policy": [], "default": 0})
