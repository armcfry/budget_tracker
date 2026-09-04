"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PixelButton, PixelModal } from "@pxlkit/ui-kit";
import TransactionForm from "./TransactionForm";
import { createTransaction } from "@/lib/client-api";
import type { Account, Tag, TransactionInput } from "@/lib/types";

export default function AddTransactionButton({
  accounts,
  tags,
  accountId,
}: Readonly<{ accounts: Account[]; tags: Tag[]; accountId?: number }>) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleClose() {
    setOpen(false);
    setError(null);
  }

  async function handleSubmit(data: TransactionInput) {
    try {
      setError(null);
      await createTransaction(data);
      setOpen(false);
      router.refresh();
    } catch {
      setError("Failed to create transaction. Please try again.");
    }
  }

  return (
    <>
      <PixelButton size="sm" tone="cyan" onClick={() => setOpen(true)}>
        + Add Transaction
      </PixelButton>
      <PixelModal open={open} title="Add Transaction" onClose={handleClose}>
        {open && <TransactionForm accounts={accounts} tags={tags} accountId={accountId} onSubmit={handleSubmit} />}
        {error && <p className="mt-2 text-sm text-retro-red">{error}</p>}
      </PixelModal>
    </>
  );
}
