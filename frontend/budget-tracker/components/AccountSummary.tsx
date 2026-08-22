"use client";

import { PixelStatCard, PixelStatGroup } from "@pxlkit/ui-kit";
import type { Account } from "@/lib/types";
import { formatCurrency } from "@/lib/api";

type AccountSummaryProps = {
  accounts: Account[];
};

const CATEGORIES = [
  { label: "Checking", type: "checking", tone: "cyan" as const },
  { label: "Savings", type: "savings", tone: "green" as const },
  { label: "Credit Cards", type: "credit_card", tone: "gold" as const },
];

export default function AccountSummary({ accounts }: Readonly<AccountSummaryProps>) {
  const totals = CATEGORIES.map((category) => {
    const matching = accounts.filter((a) => a.type === category.type);
    const total = matching.reduce((sum, a) => sum + a.balance, 0);
    return { ...category, total, count: matching.length };
  });

  return (
    <PixelStatGroup layout="grid" columns={3} aria-label="Account balance summary">
      {totals.map((category) => (
        <PixelStatCard
          key={category.label}
          label={category.label}
          value={formatCurrency(category.total)}
          trend={`${category.count} ${category.count === 1 ? "account" : "accounts"}`}
          tone={category.tone}
          bordered={false}
        />
      ))}
    </PixelStatGroup>
  );
}
