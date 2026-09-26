"use client";

import { PixelNumberInput, PixelStatGroup } from "@pxlkit/ui-kit";
import { formatCurrency } from "@/lib/api";
import type { Transaction } from "@/lib/types";
import { useState } from "react";

// TODO: get value from DB or wallet settings
const DEFAULT_SAVINGS = 500.00;

const MONTHLY_VALUES = [
  { label: "Income", value: 0, tone: "cyan" as const},
  { label: "Recurring Payments", value: 0, tone: "green" as const },
  { label: "Saving", value: DEFAULT_SAVINGS, tone: "gold" as const },
  { label: "Remaining", value: 0, tone: "gold" as const },

];

// calculate income
function calculateIncome(transactions: Transaction[]) {
  return transactions.reduce((sum, transaction) => {
    if (Number(transaction.amount) > 0) {
      sum += Number(transaction.amount);
    }
    return sum;
  }, 0);
}

// calculate recurring payments
function calculateRecurringTotal(transactions: Transaction[]) {
  return transactions.reduce((sum, transaction) => {
    if (Number(transaction.amount) < 0) {
      sum -= Number(transaction.amount);
    }
    return Math.abs(sum);
  }, 0);
}

// calculate remaining
function calculateRemaining(income: number, recurring: number, savings: number) {
  return income - recurring - savings;
}


export default function MonthlyInfo({ transactions }: Readonly<{ transactions: Transaction[] }>) {
  const [savings, setSavings] = useState(DEFAULT_SAVINGS);

  MONTHLY_VALUES[0].value = calculateIncome(transactions);
  MONTHLY_VALUES[1].value = calculateRecurringTotal(transactions);
  MONTHLY_VALUES[2].value = savings;
  MONTHLY_VALUES[3].value = calculateRemaining(MONTHLY_VALUES[0].value, MONTHLY_VALUES[1].value, savings);

  const labelClass = "p-4 pb-0 text-xs text-retro-muted font-mono";
  const valueClass = "p-4 pt-3 text-sm font-pixel text-retro-text";

  return (
    <PixelStatGroup layout="grid" columns={4} aria-label="Account balance summary">
      {/* row 1 on desktop (sm:grid-cols-4); reflows into label/value pairs below sm (grid-cols-2) */}
      <p className={`${labelClass} order-1 sm:order-none`}>{MONTHLY_VALUES[0].label}</p>
      <p className={`${labelClass} order-2 sm:order-none`}>{MONTHLY_VALUES[1].label}</p>
      <label htmlFor="savings-input" className={`${labelClass} order-5 sm:order-none`}>
        {MONTHLY_VALUES[2].label}
      </label>
      <p className={`${labelClass} order-6 sm:order-none`}>{MONTHLY_VALUES[3].label}</p>

      {/* row 2 on desktop; reflows into label/value pairs below sm */}
      <p className={`${valueClass} order-3 sm:order-none`}>{formatCurrency(MONTHLY_VALUES[0].value)}</p>
      <p className={`${valueClass} order-4 sm:order-none`}>{formatCurrency(MONTHLY_VALUES[1].value)}</p>
      <div className="p-4 pt-3 order-7 sm:order-none">
        <PixelNumberInput
          id="savings-input"
          name="savings"
          min={0}
          value={savings}
          onChange={setSavings}
          tone={MONTHLY_VALUES[2].tone}
          size="sm"
          hideControls
        />
      </div>
      <p className={`${valueClass} order-8 sm:order-none`}>{formatCurrency(MONTHLY_VALUES[3].value)}</p>
    </PixelStatGroup>
  );
};
