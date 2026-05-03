from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    settings,
    accounts,
    categories,
    tags,
    debts,
    budget_templates,
    monthly_budgets,
    recurring_transactions,
    transactions,
)

app = FastAPI(title="Budget Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(settings.router)
app.include_router(accounts.router)
app.include_router(categories.router)
app.include_router(tags.router)
app.include_router(debts.router)
app.include_router(budget_templates.router)
app.include_router(monthly_budgets.router)
app.include_router(recurring_transactions.router)
app.include_router(transactions.router)


@app.get("/health")
def health():
    return {"status": "ok"}
