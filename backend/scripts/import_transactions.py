"""
One-off import of Jan-Jun_Transactions_2026.csv into the transactions /
transaction_tags tables.

The CSV's `account_id` and `tags` columns are account/tag *names*, not ids,
and a few of those names don't match what's already in the DB. ACCOUNT_MAP
and TAG_MAP below record how each CSV name resolves to an existing row.

Usage (run inside the backend container, where DATABASE_URL is set):
    docker compose exec backend python -m scripts.import_transactions <csv_path> [--dry-run]
"""

import argparse
import csv
import sys
from datetime import datetime
from decimal import Decimal, InvalidOperation

from app.db.session import SessionLocal
from app.models.account import Account
from app.models.transaction import TransactionCreate
from app.services.transactions import create_transaction

# CSV account_id -> existing accounts.name
ACCOUNT_MAP = {
    "Amazon Card": "Amazon Prime",
    "Apple Card": "Apple Card",
    "Discover": "Discover Card",
    "Regions Debit": "Regions Checking",
    "Wells Fargo Credit": "Wells Fargo Credit",
    "Wells Fargo Debit": "Wells Fargo Checking",
}

# CSV tag name -> existing tags.name (only entries that need remapping)
TAG_MAP = {
    "Grocery": "Groceries",
}


def parse_amount(raw: str) -> Decimal:
    cleaned = raw.strip().replace("$", "").replace(",", "")
    return Decimal(cleaned)


def parse_date(raw: str):
    return datetime.strptime(raw.strip(), "%m/%d/%Y").date()


def parse_tags(raw: str) -> list[str]:
    name = raw.strip()
    if not name:
        return []
    return [TAG_MAP.get(name, name)]


def load_account_ids(db) -> dict[str, int]:
    return {a.name: a.id for a in db.query(Account).all()}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("csv_path")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Parse and validate every row without writing to the DB.",
    )
    args = parser.parse_args()

    db = SessionLocal()
    try:
        account_ids = load_account_ids(db)

        missing_accounts = {
            csv_name
            for csv_name, db_name in ACCOUNT_MAP.items()
            if db_name not in account_ids
        }
        if missing_accounts:
            print(f"ACCOUNT_MAP targets missing from accounts table: {missing_accounts}")
            sys.exit(1)

        with open(args.csv_path, newline="") as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        created = 0
        for i, row in enumerate(rows, start=2):  # row 1 is the header
            csv_account = row["account_id"].strip()
            db_account_name = ACCOUNT_MAP.get(csv_account)
            if db_account_name is None:
                print(f"Row {i}: unrecognized account_id {csv_account!r}")
                sys.exit(1)

            try:
                amount = parse_amount(row["amount"])
            except InvalidOperation:
                print(f"Row {i}: unparseable amount {row['amount']!r}")
                sys.exit(1)

            data = TransactionCreate(
                amount=amount,
                description=row["description"].strip(),
                date_value=parse_date(row["date_value"]),
                account_id=account_ids[db_account_name],
                tags=parse_tags(row["tags"]),
            )

            if args.dry_run:
                print(f"Row {i}: {data}")
            else:
                create_transaction(db, data)

            created += 1

        print(f"{'Would create' if args.dry_run else 'Created'} {created} transactions.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
