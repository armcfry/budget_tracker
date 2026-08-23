import { PixelButton, PixelInput } from "@pxlkit/ui-kit";

export default function TransactionFilterForm({
  dateMinFilter,
  dateMaxFilter,
  tagsFilter,
  amountMinFilter,
  amountMaxFilter,
}: Readonly<{
  dateMinFilter: string;
  dateMaxFilter: string;
  tagsFilter: string;
  amountMinFilter: string;
  amountMaxFilter: string;
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

        {/* TODO: fix to where multiple tags can be entered and treated as seperate tag */}
          <PixelInput
            label="Tags"
            type="text"
            name="tags"
            placeholder="e.g. groceries, rent"
            defaultValue={tagsFilter}
            size="sm"
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