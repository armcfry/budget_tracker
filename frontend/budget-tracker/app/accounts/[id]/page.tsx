import Link from "next/link";
import { notFound } from "next/navigation";
import TransactionsList, { ActiveTagFilterPill } from "@/components/TransactionsList";
import TransactionControls from "@/components/TransactionControls";
import LinkButton from "@/components/LinkButton";
import StatCard from "@/components/StatCard";
import { getAccount, getAccounts, getTransactions, sortTransactions, formatCurrency } from "@/lib/api";
import { getCurrentMonthRange, getCurrentMonthLabel } from "@/lib/dates";
import type { SortDirection, TransactionSortField } from "@/lib/types";
import AddTransactionButton from "@/components/AddTransactionButton";

type SearchParams = { [key: string]: string | string[] | undefined };

type AccountDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
};

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseTags(value: string | string[] | undefined): string[] {
  const raw = Array.isArray(value) ? value.join(",") : value ?? "";
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatAccountType(type: string) {
  return type
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

const SORT_FIELDS: { field: TransactionSortField; label: string }[] = [
  { field: "date", label: "Date" },
  { field: "amount", label: "Amount" },
  { field: "description", label: "Description" },
];

export default async function AccountDetailPage({
  params,
  searchParams,
}: Readonly<AccountDetailPageProps>) {
  const { id } = await params;
  const sp = await searchParams;

  const [account, accounts] = await Promise.all([getAccount(id), getAccounts()]);
  if (!account) {
    notFound();
  }
  const accountId = account.id;

  const hasExplicitPanelFilters =
    sp.date_min !== undefined ||
    sp.date_max !== undefined ||
    sp.amount_min !== undefined ||
    sp.amount_max !== undefined;
  const hasExplicitFilters = hasExplicitPanelFilters || sp.tags !== undefined;

  const { start: monthStart, end: monthEnd } = getCurrentMonthRange();
  const monthLabel = getCurrentMonthLabel();

  const dateMinFilter = firstValue(sp.date_min) ?? (hasExplicitFilters ? "" : monthStart);
  const dateMaxFilter = firstValue(sp.date_max) ?? (hasExplicitFilters ? "" : monthEnd);
  const tagsFilter = parseTags(sp.tags);
  const amountMinFilter = firstValue(sp.amount_min) ?? "";
  const amountMaxFilter = firstValue(sp.amount_max) ?? "";

  const rawSortField = firstValue(sp.sort);
  const sortField: TransactionSortField =
    SORT_FIELDS.some((s) => s.field === rawSortField)
      ? (rawSortField as TransactionSortField)
      : "date";
  const sortDirection: SortDirection = firstValue(sp.dir) === "asc" ? "asc" : "desc";

  const transactions = await getTransactions({
    accountId: account.id,
    dateMin: dateMinFilter || undefined,
    dateMax: dateMaxFilter || undefined,
    tags: tagsFilter.length ? tagsFilter : undefined,
    amountMin: amountMinFilter ? Number(amountMinFilter) : undefined,
    amountMax: amountMaxFilter ? Number(amountMaxFilter) : undefined,
  });
  const sortedTransactions = sortTransactions(transactions, sortField, sortDirection);

  const tagColorByName = new Map<string, string | undefined>();
  transactions
    .flatMap((tx) => tx.tags)
    .forEach((tag) => {
      if (!tagColorByName.has(tag.name)) tagColorByName.set(tag.name, tag.color);
    });

  function buildSortHref(field: TransactionSortField) {
    const params = new URLSearchParams();
    if (hasExplicitFilters) {
      if (dateMinFilter) params.set("date_min", dateMinFilter);
      if (dateMaxFilter) params.set("date_max", dateMaxFilter);
    }
    if (tagsFilter.length) params.set("tags", tagsFilter.join(","));
    if (amountMinFilter) params.set("amount_min", amountMinFilter);
    if (amountMaxFilter) params.set("amount_max", amountMaxFilter);
    const nextDirection: SortDirection =
      sortField === field && sortDirection === "desc" ? "asc" : "desc";
    params.set("sort", field);
    params.set("dir", nextDirection);
    return `/accounts/${accountId}?${params.toString()}`;
  }

  function buildTagFilterHref(tagName: string) {
    const params = new URLSearchParams();
    if (hasExplicitFilters) {
      if (dateMinFilter) params.set("date_min", dateMinFilter);
      if (dateMaxFilter) params.set("date_max", dateMaxFilter);
    }
    params.set("tags", tagName);
    if (amountMinFilter) params.set("amount_min", amountMinFilter);
    if (amountMaxFilter) params.set("amount_max", amountMaxFilter);
    params.set("sort", sortField);
    params.set("dir", sortDirection);
    return `/accounts/${accountId}?${params.toString()}`;
  }

  const tagFilterHrefByName = Object.fromEntries(
    Array.from(tagColorByName.keys()).map((name) => [name, buildTagFilterHref(name)])
  );

  function buildRemoveTagHref(tagName: string) {
    const remainingTags = tagsFilter.filter((t) => t !== tagName);
    const params = new URLSearchParams();
    if (dateMinFilter) params.set("date_min", dateMinFilter);
    if (dateMaxFilter) params.set("date_max", dateMaxFilter);
    if (remainingTags.length) params.set("tags", remainingTags.join(","));
    if (amountMinFilter) params.set("amount_min", amountMinFilter);
    if (amountMaxFilter) params.set("amount_max", amountMaxFilter);
    params.set("sort", sortField);
    params.set("dir", sortDirection);
    return `/accounts/${accountId}?${params.toString()}`;
  }

  const sortOptions = SORT_FIELDS.map(({ field, label }) => ({
    field,
    label,
    href: buildSortHref(field),
    active: sortField === field,
  }));

  return (
    <div className="flex flex-col flex-1 bg-retro-bg font-sans text-retro-text">
      <main className="flex flex-1 w-full max-w-6xl mx-auto flex-col gap-10 py-16 px-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/accounts"
              className="text-sm text-retro-muted hover:text-retro-text w-fit"
            >
              &larr; Back to Accounts
            </Link>
            <LinkButton href="/">Home</LinkButton>
          </div>

          <div>
            <h1 className="font-pixel text-lg text-retro-text">{account.name}</h1>
            <p className="text-sm text-retro-muted">{formatAccountType(account.type)}</p>
          </div>

          <div className="w-fit min-w-[220px]">
            <StatCard
              label="Current Balance"
              value={formatCurrency(account.balance)}
              tone={account.balance < 0 ? "red" : "green"}
            />
          </div>
        </div>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-pixel text-sm text-retro-text">Transactions</h2>
              <p className="text-sm text-retro-muted">
                {hasExplicitFilters ? "Custom filters applied" : `Showing ${monthLabel}`}
              </p>
            </div>

            <TransactionControls
              sortOptions={sortOptions}
              sortDirection={sortDirection}
              dateMinFilter={dateMinFilter}
              dateMaxFilter={dateMaxFilter}
              tagsFilter={tagsFilter.join(", ")}
              amountMinFilter={amountMinFilter}
              amountMaxFilter={amountMaxFilter}
              accountId={accountId}
              filtersActive={hasExplicitPanelFilters}
            />
          </div>

          {tagsFilter.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-retro-muted">Filtered by tag:</span>
              {tagsFilter.map((tagName) => (
                <ActiveTagFilterPill
                  key={tagName}
                  label={tagName}
                  color={tagColorByName.get(tagName)}
                  href={buildRemoveTagHref(tagName)}
                />
              ))}
            </div>
          )}
          <AddTransactionButton accounts={accounts} />
          <TransactionsList
            transactions={sortedTransactions}
            emptyMessage={
              hasExplicitFilters
                ? "No transactions match these filters."
                : `No transactions to display for this time period.`
            }
            tagFilterHrefByName={tagFilterHrefByName}
            editable
            accounts={accounts}
          />
        </section>
      </main>
    </div>
  );
}
