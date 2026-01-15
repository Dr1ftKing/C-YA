import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

const distPath = join(__dirname, 'dist');

console.log('Looking for dist folder at:', distPath);
console.log('Dist folder exists:', existsSync(distPath));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Proxy API requests to backend
app.use('/api', createProxyMiddleware({
  target: 'https://cya-backend-production.up.railway.app',
  changeOrigin: true,
  secure: true,
  logLevel: 'debug'
}));

// Serve static files from dist
app.use(express.static(distPath));

// Handle SPA routing - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Health check available at http://0.0.0.0:${PORT}/health`);
});