import Database from 'better-sqlite3';
import { Staff } from '../models/staff.model';
import { Redemption } from '../models/redemption.model';

export class StorageService {
  constructor(private db: Database.Database) {}

  // Lookup staff by staff_pass_id
  findStaffByPassId(staffPassId: string): Staff | null {
    const sql =`
      SELECT
        s.staff_pass_id,
        t.team_name AS team_name,
        s.created_at
      FROM staff s
      INNER JOIN teams t ON s.team_id = t.team_id
      WHERE s.staff_pass_id = ?
    `;
    const stmt = this.db.prepare<string, Staff>(sql);
    const staff = stmt.get(staffPassId)
    return staff === undefined ? null : staff;
  }

  // Get all team name instances
  findTeamNameInstances(teamName: string) {
    const stmt = this.db.prepare<string>(
      `
      SELECT COUNT(*) AS count
      FROM staff s
      INNER JOIN teams t ON t.team_name = ?
      WHERE s.team_id = t.team_id
      `
    );
    const teamNameInstances = stmt.get(teamName) as { count: number } | undefined;
    return teamNameInstances ? teamNameInstances.count : 0;
  }

  // Check if team has already redeemed
  findRedemption(teamName: string): Redemption | null {
    const sql = `
      SELECT
        s.staff_pass_id AS staff_pass_id,
        t.team_name AS team_name,
        r.redeemed_at AS redeemed_at
      FROM redemptions r
      INNER JOIN staff s ON r.staff_id = s.staff_id
      INNER JOIN teams t ON r.team_id = t.team_id
      WHERE t.team_name = ?
    `;
    const stmt = this.db.prepare<string, Redemption>(sql);
    const redemption = stmt.get(teamName);
    return redemption === undefined ? null : redemption;
  }

  // Create redemption record
  createRedemption(teamName: string, timestamp: number): Redemption {
    const stmt = this.db.prepare(
      'INSERT INTO redemptions (team_name, redeemed_at) VALUES (?, ?) RETURNING *'
    );
    return stmt.get(teamName, timestamp) as Redemption;
  }

  // Get all redemptions (for testing/admin)
  getAllRedemptions(): Redemption[] {
    const stmt = this.db.prepare('SELECT * FROM redemptions ORDER BY redeemed_at DESC');
    return stmt.all() as Redemption[];
  }
}