"use client";

import { PixelCard, PixelStatCard } from "@pxlkit/ui-kit";
import type { Account } from "@/lib/types";
import { formatCurrency } from "@/lib/api";

type AccountCardProps = {
  account: Account;
  balance: number;
};

export default function AccountCard({ account, balance }: Readonly<AccountCardProps>) {
  return (
    <PixelCard
      href={`/accounts/${account.id}`}
      title={account.name}
      description={formatAccountType(account.type)}
      interactive
      className="h-full"
    >
      <PixelStatCard label="Balance" value={formatCurrency(balance)} bordered={false} />
    </PixelCard>
  );
}

function formatAccountType(type: string) {
  return type
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
