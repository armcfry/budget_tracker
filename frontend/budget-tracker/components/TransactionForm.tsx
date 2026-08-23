"use client";

import type { SubmitEvent } from "react";
import { PixelButton, PixelInput, PixelSelect } from "@pxlkit/ui-kit";
import type { Account, Transaction, TransactionInput } from "@/lib/types";

type TransactionFormProps = {
  initialData?: Partial<Transaction>;
  accounts: Account[];
  onSubmit: (data: TransactionInput) => void | Promise<void>;
};

export default function TransactionForm({
  initialData = {},
  accounts,
  onSubmit,
}: Readonly<TransactionFormProps>) {
  const isEditing = initialData.id != null;
  const defaultTags = initialData.tags?.map((tag) => tag.name).join(", ") ?? "";

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const getString = (field: string) => (formData.get(field) as string | null) ?? "";
    const tags = getString("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    onSubmit({
      date_value: getString("date_value"),
      description: getString("description"),
      amount: Number(formData.get("amount")),
      account_id: Number(formData.get("account_id")),
      tags,
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute lg:left-auto lg:right-0 z-10 mt-2 flex w-[22rem] max-w-[calc(100vw-3rem)] flex-col gap-3 rounded-lg border-2 border-retro-border bg-retro-card p-4 shadow-lg"
    >
      <PixelInput
        label="Amount"
        type="number"
        step="0.01"
        name="amount"
        defaultValue={initialData.amount ?? ""}
        size="sm"
        required
      />

      <PixelInput
        label="Description"
        type="text"
        name="description"
        defaultValue={initialData.description ?? ""}
        size="sm"
        required
      />

      <PixelInput
        label="Date"
        type="date"
        name="date_value"
        defaultValue={initialData.date_value ?? ""}
        size="sm"
        required
      />

      <PixelSelect
        label="Account"
        name="account_id"
        options={accounts.map((account) => ({
          value: String(account.id),
          label: account.name,
        }))}
        defaultValue={initialData.account_id != null ? String(initialData.account_id) : undefined}
        size="sm"
        required
      />

      <PixelInput
        label="Tags"
        type="text"
        name="tags"
        placeholder="e.g. groceries, rent"
        defaultValue={defaultTags}
        size="sm"
      />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <PixelButton type="submit" size="sm" tone="cyan">
          {isEditing ? "Update" : "Create"}
        </PixelButton>
      </div>
    </form>
  );
}
