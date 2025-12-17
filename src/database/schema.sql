-- Reference Table: teams
CREATE TABLE IF NOT EXISTS teams (
    team_id INTEGER PRIMARY KEY,
    TE TEXT UNIQUE NOT NULL
);

-- Staff Mapping Table: staff
-- Staff Pass ID creation date is not necessary for redemption logic 
CREATE TABLE IF NOT EXISTS staff (
    staff_id INTEGER PRIMARY KEY,
    staff_pass_id TEXT UNIQUE NOT NULL,
    team_id INTEGER NOT NULL,
    created_at BIGINT, 
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Transaction Table: redemptions
CREATE TABLE IF NOT EXISTS redemptions (
    redemption_id INTEGER PRIMARY KEY,
    team_id INTEGER UNIQUE NOT NULL, 
    staff_id INTEGER NOT NULL, 
    redeemed_at BIGINT UNIQUE NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);