-- Reference Table: teams
CREATE TABLE IF NOT EXISTS teams (
    team_id BIGINT PRIMARY KEY,
    team_name TEXT UNIQUE NOT NULL
);

-- Staff Mapping Table: staff
-- Staff Pass ID creation date is not necessary for redemption logic 
CREATE TABLE IF NOT EXISTS staff (
    staff_id INTEGER PRIMARY KEY,
    staff_pass_id TEXT UNIQUE NOT NULL,
    team_id BIGINT NOT NULL,
    created_at BIGINT, 
    FOREIGN KEY (team_id) REFERENCES teams(team_id)
);

-- Transaction Table: redemptions
CREATE TABLE IF NOT EXISTS redemptions (
    id BIGINT PRIMARY KEY,
    team_id BIGINT UNIQUE NOT NULL, 
    redeemed_by_staff_id BIGINT NOT NULL, 
    redeemed_at BIGINT NOT NULL,
    FOREIGN KEY (team_id) REFERENCES teams(team_id),
    FOREIGN KEY (redeemed_by_staff_id) REFERENCES staff(staff_id)
);