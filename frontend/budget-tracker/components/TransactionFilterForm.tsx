"use client";

import { useState } from "react";
import { PixelButton, PixelInput, PixelSelect } from "@pxlkit/ui-kit";
import TagInput from "./TagInput";
import type { Tag } from "@/lib/types";
import { getMonthRange } from "@/lib/dates";

const MONTH_OPTIONS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function getYearOptions(centerYear: number) {
  const years = [];
  for (let year = centerYear + 1; year >= centerYear - 5; year--) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
}

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
  const now = new Date();
  const [dateMin, setDateMin] = useState(dateMinFilter);
  const [dateMax, setDateMax] = useState(dateMaxFilter);
  const [month, setMonth] = useState(
    dateMinFilter ? dateMinFilter.slice(5, 7) : String(now.getMonth() + 1).padStart(2, "0")
  );
  const [year, setYear] = useState(
    dateMinFilter ? dateMinFilter.slice(0, 4) : String(now.getFullYear())
  );

  function applyMonthYear(nextMonth: string, nextYear: string) {
    const { start, end } = getMonthRange(`${nextYear}-${nextMonth}`);
    setDateMin(start);
    setDateMax(end);
  }

  function handleMonthChange(value: string) {
    setMonth(value);
    applyMonthYear(value, year);
  }

  function handleYearChange(value: string) {
    setYear(value);
    applyMonthYear(month, value);
  }

  return (
    <form
          method="get"
          className="absolute lg:left-auto lg:right-0 z-10 mt-2 flex w-[22rem] max-w-[calc(100vw-3rem)] flex-col gap-3 rounded-lg border-2 border-retro-border bg-retro-card p-4 shadow-lg"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <PixelSelect
              label="Month"
              options={MONTH_OPTIONS}
              value={month}
              onChange={handleMonthChange}
              size="sm"
            />
            <PixelSelect
              label="Year"
              options={getYearOptions(now.getFullYear())}
              value={year}
              onChange={handleYearChange}
              size="sm"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <PixelInput
              label="From"
              type="date"  // TODO: change color of calendar icon to retro-text
              name="date_min"
              value={dateMin}
              onChange={(e) => setDateMin(e.target.value)}
              size="sm"
            />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
            <PixelInput
              label="To"
              type="date"
              name="date_max"
              value={dateMax}
              onChange={(e) => setDateMax(e.target.value)}
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
