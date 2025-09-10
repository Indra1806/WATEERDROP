import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';

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

// Security: CORS (allow only your frontend domain)
app.use(cors({
  origin: 'https://yourfrontenddomain.com',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true
}));

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
