-- ============================================================
-- Personal Finance App — Postgres Schema
-- ============================================================


-- --------------------------------------------------------
-- ACCOUNTS (payment sources: checking, credit cards, etc.)
-- --------------------------------------------------------
CREATE TABLE wallets (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    total_balance   DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    total_spend     DECIMAL(12,2) NOT NULL DEFAULT 0.00
);

INSERT INTO wallets (name) VALUES ('Default Wallet');


-- --------------------------------------------------------
-- ACCOUNTS (payment sources: checking, credit cards, etc.)
-- --------------------------------------------------------
CREATE TABLE accounts (
    id          SERIAL PRIMARY KEY,
    wallet_id   INT NOT NULL REFERENCES wallets(id),    -- foreign key to wallets table
    name        VARCHAR(100) NOT NULL,
    type        VARCHAR(50)  NOT NULL CHECK (type IN (
                    'checking', 'savings', 'credit_card', 'other'
                )),
    balance     DECIMAL(12,2) NOT NULL DEFAULT 0.00
);


-- --------------------------------------------------------
-- TAGS (for labeling transactions)
-- --------------------------------------------------------
CREATE TABLE tags (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    color       CHAR(7),
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Common seed categories
INSERT INTO tags (name, color) VALUES
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
-- TRANSACTIONS (core table — every dollar in/out lives here)
-- --------------------------------------------------------
CREATE TABLE transactions (
    id                          SERIAL        PRIMARY KEY,
    account_id                  INT           NOT NULL REFERENCES accounts(id),
    date_value                  DATE          NOT NULL,
    description                 VARCHAR(200)  NOT NULL,
    amount                      DECIMAL(12,2) NOT NULL
);

-- Indexes for common dashboard queries
CREATE INDEX idx_transactions_date        ON transactions(date_value);
CREATE INDEX idx_transactions_account     ON transactions(account_id);


-- --------------------------------------------------------
-- TRANSACTION TAGS (join table — many-to-many)
-- --------------------------------------------------------
CREATE TABLE transaction_tags (
    transaction_id  INT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    tag_id          INT NOT NULL REFERENCES tags(id)         ON DELETE CASCADE,
    PRIMARY KEY (transaction_id, tag_id)
);
