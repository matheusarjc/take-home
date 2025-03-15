# backend/config_backend.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import json
import os

app = FastAPI()

POLICY_FILE = "policy.json"

# Modelo para a política
class Policy(BaseModel):
    # Aqui a política é uma lista de regras e um valor default
    # Cada regra terá: variável, operador, valor a comparar e o resultado (decisão) se a condição for atendida
    policy: list
    default: float

@app.get("/policy")
def get_policy():
    if not os.path.exists(POLICY_FILE):
        # Se não existir política salva, retorna uma política vazia com default 0
        return {"policy": [], "default": 0.0}
    with open(POLICY_FILE, "r") as f:
        data = json.load(f)
    return data

@app.post("/policy")
def save_policy(policy: Policy):
    with open(POLICY_FILE, "w") as f:
        json.dump(policy.dict(), f)
    return {"message": "Policy saved successfully"}
