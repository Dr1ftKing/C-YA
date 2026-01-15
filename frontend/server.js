import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5173;

const distPath = join(__dirname, 'dist');

// Log for debugging
console.log('Looking for dist folder at:', distPath);
console.log('Dist folder exists:', existsSync(distPath));

// Serve static files from dist
app.use(express.static(distPath));

// Handle SPA routing - send all requests to index.html
app.get('*', (req, res) => {
  const indexPath = join(distPath, 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});