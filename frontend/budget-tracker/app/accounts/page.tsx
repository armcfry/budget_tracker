import AccountCard from "@/components/AccountCard";
import CardGrid from "@/components/CardGrid";
import Link from "next/link";
import { getAccounts, getTransactions } from "@/lib/api";
import { getCurrentMonthRange } from "@/lib/dates";

export default async function AccountsPage() {
  const accounts = await getAccounts();
  const balances = await Promise.all(
    accounts.map((a) => getCurrentMonthBalance(a.id))
  );

  async function getCurrentMonthBalance(accountId: number): Promise<number> {
    const { start, end } = getCurrentMonthRange();
    const transactions = await getTransactions({
      accountId,
      dateMin: start,
      dateMax: end,
    });
    // if account is savings or checking, return the account balance instead of summing transactions
    const account = accounts.find((a) => a.id === accountId);
    if (account && (account.type === "savings" || account.type === "checking")) {
      return Number(account.balance);
    } else {
      return transactions.reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    }
  }


  return (
    <div className="flex flex-col flex-1 bg-retro-bg font-sans text-retro-text">
      <main className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-10 py-16 px-6">
        <Link href="/" className="font-pixel text-lg text-retro-text w-fit">
          Budget Tracker
        </Link>

        <h1 className="font-pixel text-xl text-retro-text">Accounts</h1>
        {/* TODO: add year/ current switch, default to current */}

        {accounts.length === 0 ? (
          <p className="text-sm text-retro-muted">No accounts found.</p>
        ) : (
          <CardGrid
            items={accounts}
            keyExtractor={(a) => a.id}
            renderItem={(account, index) => (
              <AccountCard account={account} balance={balances[index]} />
            )}
          />
        )}
      </main>
    </div>
  );
}
