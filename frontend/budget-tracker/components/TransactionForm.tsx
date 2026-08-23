"use client";

import type { SubmitEvent } from "react";
import { PixelButton, PixelCheckbox, PixelInput } from "@pxlkit/ui-kit";
import AccountSelect from "./AccountSelect";
import type { Account, Transaction, TransactionInput } from "@/lib/types";
import { getTodayISODate } from "@/lib/dates";

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
        defaultValue={initialData.account_id != null ? String(initialData.account_id) : ""}
        required
        size="sm"
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
