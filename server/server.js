import dotenv from 'dotenv';
dotenv.config();


import express from 'express';
import connectDB from './config/db.js';
import cors from "cors";


import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
connectDB();
app.use(cors());


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 8080;
console.log("PORT environment variable is:", process.env.PORT);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
