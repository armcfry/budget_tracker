import AccountSummary from "@/components/AccountSummary";
import TransactionsList from "@/components/TransactionsList";
import LinkButton from "@/components/LinkButton";
import AddTransactionButton from "@/components/AddTransactionButton";
import { getAccounts, getTransactions, sortByDateDesc } from "@/lib/api";
import { getCurrentMonthRange, getCurrentMonthLabel } from "@/lib/dates";

export default async function Home() {
  const { start, end } = getCurrentMonthRange();
  const monthLabel = getCurrentMonthLabel();

  const [accounts, transactions] = await Promise.all([
    getAccounts(),
    getTransactions({ dateMin: start, dateMax: end }),
  ]);
  const monthlyTransactions = sortByDateDesc(transactions);
  const accountNameById = Object.fromEntries(accounts.map((account) => [account.id, account.name]));

  return (
    <div className="flex flex-col flex-1 bg-retro-bg font-sans text-retro-text">
      <main className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-10 py-16 px-6">
        <h1 className="font-pixel text-lg text-retro-text">Budget Tracker</h1>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <h2 className="font-pixel text-sm text-retro-text">Overview</h2>
            <LinkButton href="/accounts" tone="purple">View Accounts</LinkButton>
          </div>
          {accounts.length === 0 ? (
            <p className="text-sm text-retro-muted">No accounts found.</p>
          ) : (
            <AccountSummary accounts={accounts} />
          )}
        </section>

        <section>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between mb-3">
            <h2 className="font-pixel text-sm text-retro-text">Transactions</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-retro-muted">{monthLabel}</span>
            </div>
          </div>
          <section className="flex flex-col gap-4">
            <AddTransactionButton accounts={accounts} />
          </section>
          <TransactionsList
            transactions={monthlyTransactions}
            emptyMessage={`No transactions in ${monthLabel}.`}
            accountNameById={accountNameById}
          />
        </section>
      </main>
    </div>
  );
}