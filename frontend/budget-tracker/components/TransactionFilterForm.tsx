"use client";

import { PixelButton, PixelInput } from "@pxlkit/ui-kit";
import TagInput from "./TagInput";
import type { Tag } from "@/lib/types";

export default function TransactionFilterForm({
  dateMinFilter,
  dateMaxFilter,
  tagsFilter,
  amountMinFilter,
  amountMaxFilter,
  tags,
}: Readonly<{
  dateMinFilter: string;
  dateMaxFilter: string;
  tagsFilter: string;
  amountMinFilter: string;
  amountMaxFilter: string;
  tags: Tag[];
}>) {
  return (
    <form
          method="get"
          className="absolute lg:left-auto lg:right-0 z-10 mt-2 flex w-[22rem] max-w-[calc(100vw-3rem)] flex-col gap-3 rounded-lg border-2 border-retro-border bg-retro-card p-4 shadow-lg"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <PixelInput
              label="From"
              type="date"  // TODO: change color of calendar icon to retro-text
              name="date_min"
              defaultValue={dateMinFilter}
              size="sm"
            />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
            <PixelInput
              label="To"
              type="date"
              name="date_max"
              defaultValue={dateMaxFilter}
              size="sm"
            />
          </div>

          <TagInput
            name="tags"
            tags={tags}
            defaultValue={tagsFilter ? tagsFilter.split(",").map((t) => t.trim()).filter(Boolean) : []}
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <PixelInput
              label="Min Amount"
              type="number"
              step="0.01"
              name="amount_min"
              defaultValue={amountMinFilter}
              size="sm"
            />
            <PixelInput
              label="Max Amount"
              type="number"
              step="0.01"
              name="amount_max"
              defaultValue={amountMaxFilter}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <PixelButton type="submit" size="sm" tone="cyan">
              Apply
            </PixelButton>
          </div>
        </form>
    );
}
