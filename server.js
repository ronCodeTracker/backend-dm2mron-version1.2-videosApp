



// Name: Ronald Kiefer
// Date: May 27, 2025 Tuesday 2:10 PM
// Description: This file contains the configuration for the DigitalOcean Spaces client.




import express from 'express';
import dotenv from 'dotenv';
import videoRoutes from './routes/videoRoutes.js';
import cors from 'cors';




dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', videoRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




