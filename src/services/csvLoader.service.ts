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

  async loadData(csvFilePath: string): Promise<void> {
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

        // Read rows 
        .on('data', (row) => {
          if (Object.keys(row).length > 0) {
            let staffPassId = (row.staff_pass_id || row['staff_pass_id']).toString().trim();
            let teamName = (row.team_name || row['team_name']).toString().trim();
            let createdAt = parseInt(row.created_at || row['created_at'])

            records.push({
              staff_pass_id: staffPassId,
              team_name: teamName,
              created_at: createdAt
            });
          }
        })

        // Load tables
        .on('end', () => {
          this.loadTables(records);
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
    records.forEach(r => uniqueTeamNames.add(r.team_name.toUpperCase()));
    
    // Create team records
    const teamRecords = Array.from(uniqueTeamNames).map(name => ({
        team_name: name
    }));
    this.insertRecords('teams', teamRecords);
  }

  private createTeamIdMap(): Map<string, number> {
    // Retrieve all teams
    const sql = 'SELECT team_id, team_name FROM teams'
    const allTeams = this.db.prepare(sql).all() as { team_id: number, team_name: string }[];

    // Create Team ID Map
    const teamIdMap = new Map<string, number>();
    for (const t of allTeams) {
      teamIdMap.set(t.team_name, t.team_id);
    }

    console.log('Team ID map created.')
    return teamIdMap; 
  }

  private insertStaffRecords(records: StaffRecord[], teamIdMap: Map<string, number>): void {
    // Retrieve staff records + team ID
    let staffRecords = Array();

    // Create staff records
    for (const record of records) {
        const teamId = teamIdMap.get(record.team_name.toUpperCase());
        staffRecords.push({
          staff_pass_id: record.staff_pass_id,
          team_id: teamId, 
          created_at: record.created_at
        }); 
    }
    this.insertRecords('staff', staffRecords);
  }

  private insertRecords(tableName: string, records: any): void {
      const columns = Object.keys(records[0]);
      const columnList = columns.join(', ');
      const placeholderList = columns.map(() => '?').join(', ');
      const sql = `INSERT OR IGNORE INTO ${tableName} (${columnList}) VALUES (${placeholderList})`;
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

  private loadTables(records: StaffRecord[]): void {
    // Initialise teams table
    this.insertTeamRecords(records);
    const teamIdMap = this.createTeamIdMap(); 

    // Intialise staff table
    this.insertStaffRecords(records, teamIdMap);
  }

}