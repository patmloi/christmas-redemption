import app from './app';
import { DatabaseService } from './services/database.service';
import { CsvLoaderService } from './services/csvLoader.service';
import { StorageService } from './services/storage.service';
import { RedemptionService } from './services/redemption.service';
import { RedemptionController } from './controllers/redemptionController';
import { RedemptionRoutes } from './routes/redemptionRoutes';
import config from './config/config';

async function startServer() {

  try {
    // 1. Initialisation

    // 1.1.1.  Database 
    const dbService = new DatabaseService('./data/redemptions.db');
    const db = dbService.getDb();

    // 1.1.2. Staff table
    const csvLoader = new CsvLoaderService(db);
    const csvFilePath = './data/staff-id-to-team-mapping.csv';
    await csvLoader.loadStaffData(csvFilePath);

    // 1.2. Services
    const storageService = new StorageService(db);
    const redemptionService = new RedemptionService(storageService);
    const redemptionController = new RedemptionController(redemptionService);

    // 2. Set up routes
    app.use('/api', RedemptionRoutes(redemptionController));

    // 3. Start listening
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
