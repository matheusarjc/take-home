# backend/config_backend.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # Importa o middleware de CORS
from pydantic import BaseModel
import json
import os

app = FastAPI()

# Configuração do CORS: permite que qualquer origem acesse o backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especifique quais origens são permitidas
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define o caminho absoluto para policy.json
POLICY_FILE = os.path.join(os.path.dirname(__file__), "policy.json")

# Modelo para a política
class Policy(BaseModel):
    # A política é uma lista de regras e um valor default
    policy: list
    default: float

@app.get("/policy")
def get_policy():
    if not os.path.exists(POLICY_FILE):
        return {"policy": [], "default": 0.0}
    with open(POLICY_FILE, "r") as f:
        data = json.load(f)
    return data

@app.post("/policy")
def save_policy(policy: Policy):
    with open(POLICY_FILE, "w") as f:
        json.dump(policy.dict(), f)
    return {"message": "Policy saved successfully"}
