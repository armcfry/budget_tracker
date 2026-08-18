import type { Account } from "@/lib/types";

type AccountCardProps = {
  account: Account;
};

export default function AccountCard({ account }: Readonly<AccountCardProps>) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 flex items-center space-x-3 sm:space-x-4 h-full min-h-[90px] sm:min-h-[200px]">
      <div className="text-blue-500 text-xl sm:text-2xl">{/* icon */}</div>
      <div>
        <h3 className="text-base sm:text-xl font-semibold text-gray-900">
          {account.name}
        </h3>
        <p className="text-sm sm:text-base text-gray-700">
          {formatCurrency(account.balance)}
        </p>
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}