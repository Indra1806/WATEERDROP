import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import adminRoutes from './routes/admin.js';
import cors from 'cors';

const app = express();

// Security: HTTP headers
app.use(helmet());

// Security: Prevent NoSQL injection
app.use(mongoSanitize());

// Security: Rate limiting (e.g., max 100 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
}); 
app.use(limiter);

// Security: CORS (allow your frontend domain)
app.use(cors({
  origin: 'http://localhost:3000', // your frontend
  credentials: true
}));

// parse JSON
app.use(express.json());

// your routes here
app.get('/products', (req, res) => {
  res.json({ message: 'Products list' });
});

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // concise colored logs
}

// Optional: more detailed logs for production
if (process.env.NODE_ENV === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(process.cwd(), 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Admin routes
app.use('/admin', adminRoutes);

app.listen(8080, () => console.log('Server running on port 8080'));
