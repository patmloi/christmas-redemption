import express from 'express';

// Initialise: Express, global error handler
const app = express();
app.use(express.json());

export default app;