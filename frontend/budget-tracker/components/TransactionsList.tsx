"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import ColorChip from "@/components/ColorChip";
import type { Tag, Transaction } from "@/lib/types";
import { formatCurrency } from "@/lib/api";
import { formatDate } from "@/lib/dates";

type TransactionsListProps = {
  transactions: Transaction[];
  emptyMessage?: string;
  /** Account-detail-page mode: tag name -> href for "click to filter by this tag". */
  tagFilterHrefByName?: Record<string, string>;
  /** Homepage mode: account id -> account name. Presence also makes each row link to that account. */
  accountNameById?: Record<number, string>;
};

function TagChip({ tag, href }: Readonly<{ tag: Tag; href?: string }>) {
  const router = useRouter();
  return (
    <ColorChip
      label={tag.name}
      color={tag.color}
      onClick={href ? () => router.push(href) : undefined}
    />
  );
}

export function ActiveTagFilterPill({
  label,
  color,
  href,
}: Readonly<{ label: string; color?: string; href: string }>) {
  const router = useRouter();
  return <ColorChip label={label} color={color} onDelete={() => router.push(href)} />;
}

export default function TransactionsList({
  transactions,
  emptyMessage = "No transactions found.",
  tagFilterHrefByName,
  accountNameById,
}: Readonly<TransactionsListProps>) {
  if (transactions.length === 0) {
    return <p className="text-sm text-retro-muted">{emptyMessage}</p>;
  }

  const amountColumnWidth = `${Math.max(
    ...transactions.map((tx) => formatCurrency(tx.amount).length)
  )}ch`;

  return (
    <ul className="max-h-[36rem] overflow-x-auto overflow-y-auto divide-y divide-retro-border rounded-lg bg-retro-card shadow-md">
      {transactions.map((tx) => {
        const rowHref = accountNameById ? `/accounts/${tx.account_id}` : undefined;
        const trailingLabel = accountNameById
          ? accountNameById[tx.account_id] ?? "Account"
          : undefined;
        const rowClassName = `flex items-center gap-3 sm:gap-6 px-3 py-3 sm:px-6 sm:py-4 ${
          rowHref ? "transition-colors hover:bg-retro-surface" : ""
        }`;

        const rowContent = (
          <>
            <span
              className={`shrink-0 font-pixel text-xs sm:text-lg leading-none tabular-nums ${
                tx.amount < 0 ? "text-retro-red" : "text-retro-green"
              }`}
              style={{ minWidth: amountColumnWidth }}
            >
              {formatCurrency(tx.amount)}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="truncate text-sm font-medium text-retro-text">
                {tx.description}
              </span>
              <span className="font-mono text-xs text-retro-muted">
                {formatDate(tx.date_value)}
              </span>
            </div>
            {trailingLabel !== undefined ? (
              <span className="shrink-0 max-w-[30%] sm:max-w-[40%] truncate text-right text-sm text-retro-muted">
                {trailingLabel}
              </span>
            ) : (
              <div className="flex shrink-0 flex-wrap justify-end gap-1 max-w-[35%] sm:max-w-[40%]">
                {tx.tags.map((tag) => (
                  <TagChip key={tag.id} tag={tag} href={tagFilterHrefByName?.[tag.name]} />
                ))}
              </div>
            )}
          </>
        );

        return (
          <li key={tx.id}>
            {rowHref ? (
              <Link href={rowHref} className={rowClassName}>
                {rowContent}
              </Link>
            ) : (
              <div className={rowClassName}>{rowContent}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
