"use client";

import { PixelStatCard, PixelStatGroup } from "@pxlkit/ui-kit";
import { formatCurrency } from "@/lib/api";

// TODO: remove hard-coded values when the backend is fixed
const MONTHLY_VALUES = [
  { label: "Income", value: 5850.00, tone: "cyan" as const },
  { label: "Recurring Payments", value: 4673.56, tone: "green" as const },
  { label: "Saving", value: 500.00, tone: "gold" as const },
  { label: "Remaining", value: 5850.00 -4673.56 -500.00, tone: "gold" as const },
//   { label: "Remaining - Spent", tone: "gold" as const },

];

export default function MonthlyInfo() {
//   const totals = CATEGORIES.map((category) => {
//     const matching = accounts.filter((a) => a.type === category.type);
//     const total = matching.reduce((sum, a) => sum + a.balance, 0);
//     return { ...category, total, count: matching.length };

  return (
    <PixelStatGroup layout="grid" columns={4} aria-label="Account balance summary">
      {MONTHLY_VALUES.map((category) => (
        <PixelStatCard
          key={category.label}
          label={category.label}
          value={formatCurrency(category.value)}
          tone={category.tone}
          bordered={false}
        />
      ))}
    </PixelStatGroup>
  );
};
