-- Staff table (Provided)

CREATE TABLE IF NOT EXISTS staff (
    staff_pass_id TEXT PRIMARY KEY UNIQUE NOT NULL,
    team_name TEXT NOT NULL,
    created_at BIGINT NOT NULL
);

-- Redemptions table (New)
CREATE TABLE IF NOT EXISTS redemptions (
    team_name TEXT PRIMARY KEY UNIQUE NOT NULL,
    staff_pass_id TEXT NOT NULL,
    redeemed_at BIGINT NOT NULL
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_staff_pass_id ON staff(staff_pass_id);
CREATE INDEX IF NOT EXISTS idx_team_name ON redemptions(team_name);