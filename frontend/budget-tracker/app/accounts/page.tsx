import AccountCard from "@/components/AccountCard";
import CardGrid from "@/components/CardGrid";
import { getAccounts } from "@/lib/api";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-10 py-16 px-6">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          Accounts
        </h1>

        {accounts.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            No accounts found.
          </p>
        ) : (
          <CardGrid
            items={accounts}
            keyExtractor={(a) => a.id}
            renderItem={(account) => <AccountCard account={account} />}
          />
        )}
      </main>
    </div>
  );
}