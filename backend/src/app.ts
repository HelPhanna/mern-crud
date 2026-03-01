import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './routes';

const app: Application = express();

// Parse JSON body
// Parse JSON body
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Serve static files from uploads directory
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/', router);

// Global error handler (optional but clean)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
