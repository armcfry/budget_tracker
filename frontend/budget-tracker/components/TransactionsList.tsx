"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PixelAlertDialog, PixelIconButton, PixelModal } from "@pxlkit/ui-kit";
import ColorChip from "@/components/ColorChip";
import TransactionForm from "@/components/TransactionForm";
import { deleteTransaction, updateTransaction } from "@/lib/client-api";
import type { Account, Tag, Transaction, TransactionInput } from "@/lib/types";
import { formatCurrency } from "@/lib/api";
import { formatDate } from "@/lib/dates";

type TransactionsListProps = {
  transactions: Transaction[];
  emptyMessage?: string;
  /** Account-detail-page mode: tag name -> href for "click to filter by this tag". */
  tagFilterHrefByName?: Record<string, string>;
  /** Homepage mode: account id -> account name. Presence also makes each row link to that account. */
  accountNameById?: Record<number, string>;
  /** Shows per-row edit/delete controls. Account-detail-page only. */
  editable?: boolean;
  /** Required when `editable` is true — populates the edit form's account picker. */
  accounts?: Account[];
};

function EditIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 2.5l2 2-8 8-3 1 1-3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path
        d="M3 4h10M6.5 4V2.5h3V4M4.5 4l.5 9.5a1 1 0 001 1h4a1 1 0 001-1L11.5 4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
  editable = false,
  accounts = [],
}: Readonly<TransactionsListProps>) {
  const router = useRouter();
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (transactions.length === 0) {
    return <p className="text-sm text-retro-muted">{emptyMessage}</p>;
  }

  const amountColumnWidth = `${Math.max(
    ...transactions.map((tx) => formatCurrency(tx.amount).length)
  )}ch`;

  async function handleEditSubmit(data: TransactionInput) {
    if (!editingTx) return;
    try {
      setError(null);
      await updateTransaction(editingTx.id, data);
      setEditingTx(null);
      router.refresh();
    } catch {
      setError("Failed to update transaction. Please try again.");
    }
  }

  async function handleDeleteConfirm() {
    if (!deletingTx) return;
    await deleteTransaction(deletingTx.id);
    setDeletingTx(null);
    router.refresh();
  }

  return (
    <>
      <ul className="max-h-[36rem] overflow-x-auto overflow-y-auto divide-y divide-retro-border rounded-lg bg-retro-card shadow-md">
        {transactions.map((tx) => {
          const rowHref = accountNameById ? `/accounts/${tx.account_id}` : undefined;
          const trailingLabel = accountNameById
            ? accountNameById[tx.account_id] ?? "Account"
            : undefined;
          const rowClassName = `flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 sm:flex-nowrap sm:gap-6 px-3 py-3 sm:px-6 sm:py-4 ${
            rowHref ? "transition-colors hover:bg-retro-surface" : ""
          }`;

          const rowContent = (
            <>
              <div className="order-1 flex w-full flex-col gap-1 sm:order-2 sm:w-auto sm:min-w-0 sm:flex-1">
                <span className="truncate text-sm font-medium text-retro-text">
                  {tx.description}
                </span>
                <span className="font-mono text-xs text-retro-muted">
                  {formatDate(tx.date_value)}
                </span>
              </div>
              <span
                className={`order-2 shrink-0 font-pixel text-xs sm:order-1 sm:text-lg leading-none tabular-nums ${
                  tx.amount < 0 ? "text-retro-red" : "text-retro-green"
                }`}
                style={{ minWidth: amountColumnWidth }}
              >
                {formatCurrency(tx.amount)}
              </span>
              {trailingLabel !== undefined ? (
                <span className="order-3 shrink-0 max-w-[30%] sm:max-w-[40%] truncate text-right text-sm text-retro-muted">
                  {trailingLabel}
                </span>
              ) : (
                <div className="order-3 flex shrink-0 flex-wrap justify-end gap-1 max-w-[35%] sm:max-w-[40%]">
                  {tx.tags.map((tag) => (
                    <TagChip key={tag.id} tag={tag} href={tagFilterHrefByName?.[tag.name]} />
                  ))}
                </div>
              )}
              {editable && (
                <div className="order-4 flex shrink-0 items-center gap-1">
                  <PixelIconButton
                    label="Edit transaction"
                    icon={<EditIcon />}
                    size="sm"
                    tone="cyan"
                    onClick={() => setEditingTx(tx)}
                  />
                  <PixelIconButton
                    label="Delete transaction"
                    icon={<TrashIcon />}
                    size="sm"
                    tone="red"
                    onClick={() => setDeletingTx(tx)}
                  />
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

      {error && <p className="mt-2 text-sm text-retro-red">{error}</p>}

      {editable && (
        <>
          <PixelModal
            open={editingTx != null}
            title="Edit Transaction"
            onClose={() => {
              setEditingTx(null);
              setError(null);
            }}
          >
            {editingTx && (
              <TransactionForm accounts={accounts} initialData={editingTx} onSubmit={handleEditSubmit} />
            )}
          </PixelModal>

          <PixelAlertDialog
            open={deletingTx != null}
            onOpenChange={(open) => {
              if (!open) setDeletingTx(null);
            }}
            title="Delete transaction?"
            description={
              deletingTx ? `This will permanently delete "${deletingTx.description}".` : undefined
            }
            actionLabel="Delete"
            destructive
            onAction={handleDeleteConfirm}
            onError={() => setError("Failed to delete transaction. Please try again.")}
          />
        </>
      )}
    </>
  );
}
