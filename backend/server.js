const path = require('path');
const express = require('express');

const cors = require('cors');

const productsRouter = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/products', productsRouter);

// Servir frontend estático (asumo que la carpeta KIOSKadmin está al mismo nivel)
const frontendPath = path.join(__dirname, '..', 'KIOSKadmin');
app.use(express.static(frontendPath));

// Cualquier otra ruta del navegador, servir index.html (SPA simple)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
