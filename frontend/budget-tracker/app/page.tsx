import AccountSummary from "@/components/AccountSummary";
import Link from "next/link";
import { getAccounts, getTransactions, formatCurrency } from "@/lib/api";

export default async function Home() {
  const [accounts, transactions] = await Promise.all([
    getAccounts(),
    getTransactions(),
  ]);

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-10 py-16 px-6">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Budget Tracker
        </h1>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium text-black dark:text-zinc-50">
              Overview
            </h2>
            <Link
              href="/accounts"
              className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md px-4 py-2"
            >
              View Accounts
            </Link>
          </div>
          {accounts.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No accounts found.
            </p>
          ) : (
            <AccountSummary accounts={accounts} />
          )}
        </section>

        <section>
          <h2 className="text-lg font-medium text-black dark:text-zinc-50 mb-3">
            Recent Transactions
          </h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              No transactions found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                    <th className="py-2 font-normal">Date</th>
                    <th className="py-2 font-normal">Description</th>
                    <th className="py-2 font-normal">Tags</th>
                    <th className="py-2 font-normal text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-b border-zinc-100 dark:border-zinc-900"
                    >
                      <td className="py-2 text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                        {tx.date_value}
                      </td>
                      <td className="py-2 text-black dark:text-zinc-50">
                        {tx.description}
                      </td>
                      <td className="py-2 text-zinc-600 dark:text-zinc-400">
                        {tx.tags.map((t) => t.name).join(", ")}
                      </td>
                      <td className="py-2 text-right text-black dark:text-zinc-50">
                        {formatCurrency(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}