import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import contentRoutes from './routes/content.routes';
// Add this right before app.listen()
import errorHandler from './middleware/error.middleware';
import bootstrapSuperAdmin from './config/bootstrap';

config({ path: '.env.local' });
config({ path: '.env' });
connectDB().then(bootstrapSuperAdmin).catch((error) => {
  console.error('Database bootstrap failed; the API will stay running, but Supabase-backed requests will fail until connectivity is restored.', error);
});

const app = express();
// Middleware
const configuredOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8081,http://localhost:19006')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allowed?: boolean) => void) => {
    if (!origin || configuredOrigins.includes('*') || configuredOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS origin not allowed: ${origin}`));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export { app };
export default app;

// Vercel imports the Express app as a serverless function. Keep the local
// listener for development and traditional Node deployments only.
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
