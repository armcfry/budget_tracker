import AccountCard from "@/components/AccountCard";
import CardGrid from "@/components/CardGrid";
import Link from "next/link";
import { getAccounts } from "@/lib/api";

export default async function AccountsPage() {
  const accounts = await getAccounts();

  return (
    <div className="flex flex-col flex-1 bg-retro-bg font-sans text-retro-text">
      <main className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-10 py-16 px-6">
        <Link href="/" className="font-pixel text-lg text-retro-text w-fit">
          Budget Tracker
        </Link>

        <h1 className="font-pixel text-xl text-retro-text">Accounts</h1>

        {accounts.length === 0 ? (
          <p className="text-sm text-retro-muted">No accounts found.</p>
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