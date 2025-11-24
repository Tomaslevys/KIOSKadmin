const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const dataFile = path.join(__dirname, '..', 'data', 'products.json');

// helper: leer archivo
async function readProducts() {
  try {
    const content = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// helper: escribir archivo
async function writeProducts(products) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(products, null, 2), 'utf8');
}

// GET /api/products  -> lista
router.get('/', async (req, res) => {
  try {
    const products = await readProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al leer productos' });
  }
});

// POST /api/products -> crear nuevo producto
router.post('/', async (req, res) => {
  try {
    const { name, type, price, quantity } = req.body;
    if (!name || !type || price == null || quantity == null) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }
    const products = await readProducts();
    const newProduct = {
      id: uuidv4(),
      name,
      type,
      price: Number(price),
      quantity: Number(quantity)
    };
    products.push(newProduct);
    await writeProducts(products);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

// PUT /api/products/:id -> actualizar producto (nombre, tipo, precio, cantidad)
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, type, price, quantity } = req.body;
    const products = await readProducts();
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    const updated = { ...products[idx] };
    if (name !== undefined) updated.name = name;
    if (type !== undefined) updated.type = type;
    if (price !== undefined) updated.price = Number(price);
    if (quantity !== undefined) updated.quantity = Number(quantity);

    products[idx] = updated;
    await writeProducts(products);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

// DELETE /api/products/:id -> eliminar
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const products = await readProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length === products.length) return res.status(404).json({ error: 'Producto no encontrado' });

    await writeProducts(filtered);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
