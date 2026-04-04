-- ============================================================
-- Personal Finance App — Postgres Schema
-- ============================================================

-- --------------------------------------------------------
-- SETTINGS (single-row table for user financial preferences)
-- --------------------------------------------------------
CREATE TABLE settings (
    id                  SERIAL PRIMARY KEY,
    monthly_income      DECIMAL(12,2),
    monthly_savings_goal DECIMAL(12,2),
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with a default row so the app always has something to update
INSERT INTO settings (monthly_income, monthly_savings_goal) VALUES (0, 0);


-- --------------------------------------------------------
-- ACCOUNTS (payment sources: checking, credit cards, etc.)
-- --------------------------------------------------------
CREATE TABLE accounts (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(50)  NOT NULL CHECK (type IN (
                    'checking', 'savings', 'credit_card', 'cash', 'other'
                )),
    nickname    VARCHAR(100),
    last_four   CHAR(4),
    is_active   BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------
-- CATEGORIES (structured budget anchors for dashboard + budgeting)
-- --------------------------------------------------------
CREATE TABLE categories (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    color       CHAR(7),        -- hex color, e.g. '#4CAF50', for dashboard display
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Common seed categories
INSERT INTO categories (name, color) VALUES
    ('Rent',  '#E53935'),
    ('Groceries',        '#43A047'),
    ('Gas',              '#FB8C00'),
    ('Food',       '#F4511E'),
    ('Subscriptions',    '#8E24AA'),
    ('Utilities',        '#00ACC1'),
    ('Insurance',        '#3949AB'),
    ('Medical',       '#D81B60'),
    ('Entertainment',    '#FFB300'),
    ('Clothing',         '#6D4C41'),
    ('Travel',           '#00897B'),
    ('Debt Payment',     '#B71C1C'),
    ('Income',           '#1B5E20'),
    ('Savings',          '#0D47A1'),
    ('Cats',    '#757575');


-- --------------------------------------------------------
-- TAGS (freeform labels, many-to-many with transactions)
-- --------------------------------------------------------
CREATE TABLE tags (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------
-- DEBTS (loan / debt tracker)
-- --------------------------------------------------------
CREATE TABLE debts (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100) NOT NULL,          -- e.g. "Car Loan", "Student Loan"
    type                VARCHAR(50)  NOT NULL CHECK (type IN (
                            'mortgage', 'auto', 'student', 'personal', 'credit_card', 'other'
                        )),
    original_balance    DECIMAL(12,2) NOT NULL,
    current_balance     DECIMAL(12,2) NOT NULL,
    interest_rate       DECIMAL(6,4),                  -- e.g. 0.0525 = 5.25%
    minimum_payment     DECIMAL(12,2),
    due_day_of_month    SMALLINT CHECK (due_day_of_month BETWEEN 1 AND 31),
    account_id          INT REFERENCES accounts(id),   -- account typically used to pay this
    is_active           BOOLEAN DEFAULT TRUE,
    notes               TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------
-- BUDGET TEMPLATES (default monthly allocation per category)
-- --------------------------------------------------------
CREATE TABLE budget_templates (
    id              SERIAL PRIMARY KEY,
    category_id     INT          NOT NULL REFERENCES categories(id) UNIQUE,
    amount          DECIMAL(12,2) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------
-- MONTHLY BUDGETS (generated instances from templates each month)
-- --------------------------------------------------------
CREATE TABLE monthly_budgets (
    id              SERIAL PRIMARY KEY,
    category_id     INT           NOT NULL REFERENCES categories(id),
    year            SMALLINT      NOT NULL,
    month           SMALLINT      NOT NULL CHECK (month BETWEEN 1 AND 12),
    budget_amount   DECIMAL(12,2) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (category_id, year, month)
);


-- --------------------------------------------------------
-- RECURRING TRANSACTIONS (monthly default transaction templates)
-- --------------------------------------------------------
CREATE TABLE recurring_transactions (
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(200)  NOT NULL,
    amount          DECIMAL(12,2) NOT NULL,
    type            VARCHAR(10)   NOT NULL DEFAULT 'debit' CHECK (type IN ('debit', 'credit')),
    account_id      INT           REFERENCES accounts(id),
    category_id     INT           REFERENCES categories(id),
    debt_id         INT           REFERENCES debts(id),   -- set if this is a loan payment
    day_of_month    SMALLINT      CHECK (day_of_month BETWEEN 1 AND 31),
    description     TEXT,
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);


-- --------------------------------------------------------
-- TRANSACTIONS (core table — every dollar in/out lives here)
-- --------------------------------------------------------
CREATE TABLE transactions (
    id                          SERIAL PRIMARY KEY,
    date                        DATE          NOT NULL,
    title                       VARCHAR(200)  NOT NULL,
    amount                      DECIMAL(12,2) NOT NULL,  -- always positive; direction set by type
    type                        VARCHAR(10)   NOT NULL DEFAULT 'debit' CHECK (type IN ('debit', 'credit')),
    account_id                  INT           NOT NULL REFERENCES accounts(id),
    category_id                 INT           REFERENCES categories(id),
    debt_id                     INT           REFERENCES debts(id),
    recurring_transaction_id    INT           REFERENCES recurring_transactions(id),
    description                 TEXT,
    created_at                  TIMESTAMPTZ DEFAULT NOW(),
    updated_at                  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for common dashboard queries
CREATE INDEX idx_transactions_date        ON transactions(date);
CREATE INDEX idx_transactions_account     ON transactions(account_id);
CREATE INDEX idx_transactions_category    ON transactions(category_id);
CREATE INDEX idx_transactions_type        ON transactions(type);


-- --------------------------------------------------------
-- TRANSACTION TAGS (join table — many-to-many)
-- --------------------------------------------------------
CREATE TABLE transaction_tags (
    transaction_id  INT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    tag_id          INT NOT NULL REFERENCES tags(id)         ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, tag_id)
);


-- --------------------------------------------------------
-- HELPER FUNCTION: auto-update updated_at on any table
-- --------------------------------------------------------
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON debts
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON budget_templates
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON recurring_transactions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
