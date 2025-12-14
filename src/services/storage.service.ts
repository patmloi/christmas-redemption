import Database from 'better-sqlite3';
import { Staff } from '../models/staff.model';
import { Redemption } from '../models/redemption.model';

export class StorageService {
  constructor(private db: Database.Database) {}

  // Lookup staff by staff_pass_id
  findStaffByPassId(staffPassId: string): Staff | null {
    const stmt = this.db.prepare(
      'SELECT * FROM staff WHERE staff_pass_id = ?'
    );
    return stmt.get(staffPassId) as Staff | undefined || null;
  }

  // Check if team has already redeemed
  findRedemption(teamName: string): Redemption | null {
    const stmt = this.db.prepare(
      'SELECT * FROM redemptions WHERE team_name = ?'
    );
    return stmt.get(teamName) as Redemption | undefined || null;
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