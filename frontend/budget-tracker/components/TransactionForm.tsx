"use client";

import type { SubmitEvent } from "react";
import { PixelButton, PixelCheckbox, PixelInput } from "@pxlkit/ui-kit";
import AccountSelect from "./AccountSelect";
import TagInput from "./TagInput";
import type { Account, Tag, Transaction, TransactionInput } from "@/lib/types";
import { getTodayISODate } from "@/lib/dates";

type TransactionFormProps = {
  initialData?: Partial<Transaction>;
  accounts: Account[];
  tags: Tag[];
  accountId?: number;
  onSubmit: (data: TransactionInput) => void | Promise<void>;
};

export default function TransactionForm({
  initialData = {},
  accounts,
  tags,
  accountId,
  onSubmit,
}: Readonly<TransactionFormProps>) {
  const isEditing = initialData.id != null;
  const defaultTags = initialData.tags?.map((tag) => tag.name) ?? [];

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const getString = (field: string) => (formData.get(field) as string | null) ?? "";
    const tags = getString("tags")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const magnitude = Math.abs(Number(formData.get("amount")));
    const isIncome = formData.get("is_income") === "on";
    
    onSubmit({
      date_value: getString("date_value"),
      description: getString("description"),
      amount: isIncome ? magnitude : -magnitude,
      account_id: Number(formData.get("account_id")),
      tags,
    });
  }

  function getAccountId() {
    let id = initialData.account_id != null ? String(initialData.account_id) : "";
    if(id == "" && accountId != null) {
      id = String(accountId);
    }
    return id;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <PixelInput
        label="Amount"
        type="number"
        step="0.01"
        min="0"
        name="amount"
        defaultValue={initialData.amount != null ? Math.abs(initialData.amount) : ""}
        size="sm"
        required
      />

      <PixelCheckbox
        label="Income"
        name="is_income"
        defaultChecked={initialData.amount != null ? initialData.amount > 0 : false}
        tone="green"
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
        defaultValue={initialData.date_value ?? getTodayISODate()}
        size="sm"
        required
      />

      <AccountSelect
        accounts={accounts}
        name="account_id"
        defaultValue={getAccountId()}
        required
        size="sm"
      />

      <TagInput name="tags" tags={tags} defaultValue={defaultTags} />

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <PixelButton type="submit" size="sm" tone="cyan">
          {isEditing ? "Update" : "Create"}
        </PixelButton>
      </div>
    </form>
  );
}
