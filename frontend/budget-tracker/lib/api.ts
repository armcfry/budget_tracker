import type {
  Account,
  SortDirection,
  Transaction,
  TransactionFilters,
  TransactionSortField,
} from "@/lib/types";

// Server-side fetches run inside the frontend container, so they need the
// internal Docker service URL, not NEXT_PUBLIC_API_URL (which is for the browser).
const API_URL = process.env.INTERNAL_API_URL ?? "http://localhost:8000";

export async function getAccounts(): Promise<Account[]> {
  try {
    const res = await fetch(`${API_URL}/accounts`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((a: Account) => ({ ...a, balance: Number(a.balance) }));
  } catch {
    return [];
  }
}

export async function getAccount(id: number | string): Promise<Account | null> {
  try {
    const res = await fetch(`${API_URL}/accounts/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return { ...data, balance: Number(data.balance) };
  } catch {
    return null;
  }
}

export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters.accountId != null) {
    params.set("account_id", String(filters.accountId));
  }
  if (filters.date) {
    params.set("date", filters.date);
  }
  if (filters.dateMin) {
    params.set("date_min", filters.dateMin);
  }
  if (filters.dateMax) {
    params.set("date_max", filters.dateMax);
  }
  for (const tag of filters.tags ?? []) {
    params.append("tags", tag);
  }
  if (filters.amountMin != null) {
    params.set("amount_min", String(filters.amountMin));
  }
  if (filters.amountMax != null) {
    params.set("amount_max", String(filters.amountMax));
  }

  try {
    const res = await fetch(`${API_URL}/transactions?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export function sortByDateDesc(transactions: Transaction[]): Transaction[] {
  return sortTransactions(transactions, "date", "desc");
}

export function sortTransactions(
  transactions: Transaction[],
  field: TransactionSortField,
  direction: SortDirection
): Transaction[] {
  const sign = direction === "asc" ? 1 : -1;
  return transactions.toSorted((a, b) => {
    switch (field) {
      case "amount":
        return (a.amount - b.amount) * sign;
      case "description":
        return a.description.localeCompare(b.description) * sign;
      case "date":
      default:
        return (a.date_value < b.date_value ? -1 : a.date_value > b.date_value ? 1 : 0) * sign;
    }
  });
}

export function formatCurrency(value: number) {
  console.log(value)
  
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}