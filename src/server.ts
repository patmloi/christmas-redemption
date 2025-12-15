import app from './app';
import { DatabaseService } from './services/database.service';
import { CsvLoaderService } from './services/csvLoader.service';
import { StaffService } from './services/staff.service';
import { StorageService } from './services/storage.service';
import { RedemptionService } from './services/redemption.service';
import { RedemptionController } from './controllers/redemptionController';
import { StaffController } from './controllers/staffController';
import { RedemptionRoutes } from './routes/redemptionRoutes';
import { StaffRoutes } from './routes/staffRoutes';
import config from './config/config';

async function startServer() {

  try {
    // 1. Initialisation

    // 1.1.1.  Database 
    console.log('Initializing database...');
    const dbService = new DatabaseService('./data/redemptions.db');
    const db = dbService.getDb();

    // 1.1.2. Staff table
    console.log('Loading CSV data...');
    const csvLoader = new CsvLoaderService(db);
    const csvFilePath = './data/staff-id-to-team-mapping.csv';
    await csvLoader.loadStaffData(csvFilePath);

    // 1.2. Services
    console.log('Initializing services...');
    const storageService = new StorageService(db);
    const staffService = new StaffService(storageService);
    const redemptionService = new RedemptionService(storageService);

    // 1.3. Controllers
    console.log('Initializing controllers...');
    const staffController = new StaffController(staffService);
    const redemptionController = new RedemptionController(redemptionService);

    // 2. Set up routes
    app.use('/api/staff', StaffRoutes(staffController));
    app.use('/api/redemption', RedemptionRoutes(redemptionController));

    // 3. Start listening
    app.listen(config.port, () => {
      console.log('Setting up routes...');
      console.log(`Server running on port ${config.port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
