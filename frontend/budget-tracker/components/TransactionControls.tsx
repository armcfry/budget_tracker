"use client";

import Link from "next/link";
import { PixelButton } from "@pxlkit/ui-kit";
import TransactionFilterForm from "./TransactionFilterForm";

type SortOption = {
  field: string;
  label: string;
  href: string;
  active: boolean;
};

type TransactionControlsProps = {
  sortOptions: SortOption[];
  sortDirection: "asc" | "desc";
  dateMinFilter: string;
  dateMaxFilter: string;
  tagsFilter: string;
  amountMinFilter: string;
  amountMaxFilter: string;
  accountId: number;
  filtersActive: boolean;
};

export default function TransactionControls({
  sortOptions,
  sortDirection,
  dateMinFilter,
  dateMaxFilter,
  tagsFilter,
  amountMinFilter,
  amountMaxFilter,
  accountId,
  filtersActive,
}: Readonly<TransactionControlsProps>) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        href={`/accounts/${accountId}`}
        className="text-sm text-retro-muted underline hover:text-retro-text"
      >
        Clear Filters
      </Link>
      <div className="flex flex-wrap items-center gap-1 rounded-md border-2 border-retro-border p-1">
        {/* On clear filters remove highlighting of buttons */}
        {sortOptions.map((opt) => (
          <PixelButton
            key={opt.field}
            asChild
            size="sm"
            variant={opt.active ? "solid" : "ghost"}
            tone={opt.active ? "cyan" : "neutral"}
          >
            <Link href={opt.href} className="whitespace-nowrap">
              {opt.label}
              {opt.active ? (sortDirection === "asc" ? " ↑" : " ↓") : ""}
            </Link>
          </PixelButton>
        ))}


        <details className="relative" open={filtersActive}>
          <summary className="w-fit cursor-pointer list-none select-none">
            {/* TODO: on click open close to change color, not filters active */}
            <PixelButton asChild size="sm" variant={ filtersActive ? "solid" : "ghost"} tone={filtersActive ? "green" : "neutral"}>
              <span>Filters</span>
            </PixelButton>
          </summary>

          <TransactionFilterForm
            dateMinFilter={dateMinFilter}
            dateMaxFilter={dateMaxFilter}
            tagsFilter={tagsFilter}
            amountMinFilter={amountMinFilter}
            amountMaxFilter={amountMaxFilter} />
        </details>
      </div>
    </div>
  );
}
