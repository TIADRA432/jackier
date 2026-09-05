import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './src/routes/index';
import { errorHandler } from './src/middlewares/error.middleware';
import './src/config/supabase';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

// Local/static hosting fallback only. Production serverless hosting should serve
// the Angular build with the platform's static asset layer.
const distPath = path.join(__dirname, 'dist');
try {
  app.use(express.static(distPath));
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'), err => err && next(err));
  });
} catch {
  // The dist directory is optional when the API is deployed independently.
}

const PORT = Number(process.env.PORT || 3001);
if (process.env.NODE_ENV !== 'production' || process.env.RUN_EXPRESS_SERVER === 'true') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
