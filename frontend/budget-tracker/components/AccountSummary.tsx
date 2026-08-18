import type { Account } from "@/lib/types";
import { formatCurrency } from "@/lib/api";

type AccountSummaryProps = {
  accounts: Account[];
};

const CATEGORIES = [
  { label: "Checking", type: "checking" },
  { label: "Savings", type: "savings" },
  { label: "Credit Cards", type: "credit_card" },
] as const;

export default function AccountSummary({ accounts }: Readonly<AccountSummaryProps>) {
  const totals = CATEGORIES.map((category) => {
    const matching = accounts.filter((a) => a.type === category.type);
    const total = matching.reduce((sum, a) => sum + a.balance, 0);
    return { ...category, total, count: matching.length };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {totals.map((category) => (
        <div
          key={category.label}
          className="bg-white shadow-md rounded-lg p-4 sm:p-6 h-full min-h-[90px] sm:min-h-[140px] flex flex-col justify-center dark:bg-zinc-900"
        >
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {category.label}
          </p>
          <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-zinc-50 mt-1">
            {formatCurrency(category.total)}
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
            {category.count} {category.count === 1 ? "account" : "accounts"}
          </p>
        </div>
      ))}
    </div>
  );
}