import os

from app.routers import (
    accounts,
    tags,
    transactions,
    wallets
)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Budget Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGIN", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(accounts.router)
app.include_router(tags.router)
app.include_router(transactions.router)
app.include_router(wallets.router)


@app.get("/health")
def health():
    return {"status": "ok"}
