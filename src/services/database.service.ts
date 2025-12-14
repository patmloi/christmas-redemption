import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

export class DatabaseService {
  private db: Database.Database;

  constructor(dbPath: string = './data/redemptions.db') {
    // Ensure data directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create/open database
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // Better performance

    // Initialize schema
    this.initializeSchema();
  }

  private initializeSchema(): void {
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    this.db.exec(schema);
    console.log('Database schema initialized');
  }

  // Get database instance for queries
  getDb(): Database.Database {
    return this.db;
  }

  // Close database connection
  close(): void {
    this.db.close();
  }
}