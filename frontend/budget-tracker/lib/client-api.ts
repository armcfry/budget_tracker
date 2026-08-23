import type { Transaction, TransactionInput } from "@/lib/types";

// Called from client components, which run in the browser and need the
// externally-reachable API URL (INTERNAL_API_URL in lib/api.ts only
// resolves inside the Docker network).
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function createTransaction(data: TransactionInput): Promise<Transaction> {
  const res = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to create transaction");
  }
  const created = await res.json();
  return { ...created, amount: Number(created.amount) };
}

export async function updateTransaction(
  id: number,
  data: Partial<TransactionInput>
): Promise<Transaction> {
  const res = await fetch(`${API_URL}/transactions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Failed to update transaction");
  }
  const updated = await res.json();
  return { ...updated, amount: Number(updated.amount) };
}

export async function deleteTransaction(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Failed to delete transaction");
  }
}
