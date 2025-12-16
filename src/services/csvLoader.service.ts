import fs from 'fs';
import csv from 'csv-parser';
import Database from 'better-sqlite3';

interface StaffRecord {
  staff_pass_id: string;
  team_name: string;
  created_at: number;
}

export class CsvLoaderService {
  constructor(private db: Database.Database) {}

  async loadStaffData(csvFilePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const records: StaffRecord[] = [];

      // Check if CSV file exists
      if (!fs.existsSync(csvFilePath)) {
        reject(new Error(`CSV file not found: ${csvFilePath}`));
        return;
      }

      fs.createReadStream(csvFilePath)
        .pipe(csv({ 
          mapHeaders: ({ header }) => header.trim() 
        }))
        .on('data', (row) => {
          console.log('Raw row:', row);
          records.push({
            staff_pass_id: row.staff_pass_id || row['staff_pass_id'],
            team_name: row.team_name || row['team_name'],
            created_at: parseInt(row.created_at || row['created_at'])
          });
        })
        .on('end', () => {
          console.log(`Total records parsed: ${records.length}`); // DEBUG
          console.log('First record:', records[0]); // DEBUG
          console.log(`Loaded ${records.length} staff records from CSV`);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private insertTeamRecords(records: StaffRecord[]): void {
    // Retrieve unique team names
    const uniqueTeamNames = new Set<string>();
      records.forEach(r => uniqueTeamNames.add(r.team_name));
    
    // Create team records
    const teamRecords = Array.from(uniqueTeamNames).map(name => ({
              team_name: name
          }));
    this.insertRecords('teams', teamRecords);
  }

  private createTeamIdMap(): Map<string, number> {
    // Retrieve all teams
    const sql = 'SELECT id, name FROM teams'
    const allTeams = this.db.prepare(sql).all() as { id: number, name: string }[];

    // Create Team ID Map
    const teamIdMap = new Map<string, number>();
    for (const t of allTeams) {
      teamIdMap.set(t.name, t.id);
    }
    return teamIdMap; 
  }

  private insertRecords(tableName: string, records: any): void {
      const columns = Object.keys(records[0]);
      const columnList = columns.join(', ');
      const placeholderList = columns.map(() => '?').join(', ');
      const sql = `INSERT INTO ${tableName} (${columnList}) VALUES (${placeholderList})`;
      const insert = this.db.prepare(sql);
      const insertMany = this.db.transaction((records: any): void => {
        for (const record of records) {
          const values = columns.map(col => record[col]);
          insert.run(...values);
        }
      }); 
      insertMany(records);
      console.log(`Successfully inserted ${records.length} records into ${tableName}.`); 
  }
}