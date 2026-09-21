import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { adminLoginSchema, menuItemSchema, categorySchema, restaurantConfigSchema } from './src/utils/validationSchemas.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------
// SECURITY & RATE LIMITING (DevSecOps)
// ----------------------------------------------------

// Rate limiter for general public API endpoints (100 requests per 15 mins)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for Admin auth & management endpoints (10 requests per minute)
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    error: 'تم تجاوز عدد المحاولات المسموحة! يرجى الانتظار دقيقة واحدة قبل المحاولة مجدداً | Rate limit exceeded for admin actions. Try again in 1 minute.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', generalLimiter);
app.use('/api/admin', adminLimiter);

// ----------------------------------------------------
// SECURE API ENDPOINTS & ZOD INPUT VALIDATION
// ----------------------------------------------------

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    security: 'DevSecOps active with Zod validation & express-rate-limit',
    timestamp: new Date().toISOString(),
  });
});

// Admin Login Route (Rate Limited & Zod Validated)
app.post('/api/admin/login', (req, res) => {
  const result = adminLoginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'المدخلات غير صالحة | Invalid input',
      details: result.error.issues,
    });
  }

  const { pin } = result.data;
  const masterPin = process.env.ADMIN_PIN || '1234';

  if (pin === masterPin) {
    return res.json({ success: true, message: 'Authenticated successfully' });
  } else {
    return res.status(401).json({ error: 'رمز PIN غير صحيح | Incorrect PIN' });
  }
});

// Validate Item Data Endpoint
app.post('/api/admin/validate-item', (req, res) => {
  const result = menuItemSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'بيانات الصنف غير صالحة | Invalid item data',
      details: result.error.issues,
    });
  }
  return res.json({ success: true, data: result.data });
});

// Validate Config Endpoint
app.post('/api/admin/validate-config', (req, res) => {
  const result = restaurantConfigSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'إعدادات المطعم غير صالحة | Invalid configuration',
      details: result.error.issues,
    });
  }
  return res.json({ success: true, data: result.data });
});

// ----------------------------------------------------
// VITE MIDDLEWARE (Development vs Production)
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
