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
          console.log('📝 Raw row:', row);
          records.push({
            staff_pass_id: row.staff_pass_id || row['staff_pass_id'],
            team_name: row.team_name || row['team_name'],
            created_at: parseInt(row.created_at || row['created_at'])
          });
        })
        .on('end', () => {
          console.log(`📊 Total records parsed: ${records.length}`); // DEBUG
          console.log('📊 First record:', records[0]); // DEBUG
          // Insert all records into database
          this.insertStaffRecords(records);
          console.log(`Loaded ${records.length} staff records from CSV`);
          resolve();
        })
        .on('error', (error) => {
          reject(error);
        });
    });
  }

  private insertStaffRecords(records: StaffRecord[]): void {
    // Clear existing data (optional - remove if you want to keep old data)
    this.db.prepare('DELETE FROM staff').run();

    // Use transaction for better performance
    const insert = this.db.prepare(
      'INSERT OR IGNORE INTO staff (staff_pass_id, team_name, created_at) VALUES (?, ?, ?)'
    );

    const insertMany = this.db.transaction((records: StaffRecord[]) => {
      for (const record of records) {
        insert.run(record.staff_pass_id, record.team_name, record.created_at);
      }
    });

    insertMany(records);
  }
}