export type Account = {
  id: number;
  name: string;
  type: string;
  balance: number;
  wallet_id: number;
};

export type Tag = {
  id: number;
  name: string;
  color?: string;
};

export type Transaction = {
  id: number;
  date_value: string;
  description: string;
  amount: number;
  account_id: number;
  tags: Tag[];
};

export type TransactionInput = {
  date_value: string;
  description: string;
  amount: number;
  account_id: number;
  tags: string[];
};

export type TransactionFilters = {
  accountId?: number;
  date?: string;
  dateMin?: string;
  dateMax?: string;
  tags?: string[];
  amountMin?: number;
  amountMax?: number;
  recurring?: boolean;
};

export type TransactionSortField = "date" | "amount" | "description";
export type SortDirection = "asc" | "desc";