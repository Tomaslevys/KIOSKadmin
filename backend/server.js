// Backend MUY simple para KioskAdmin
// Guarda y lee productos desde productos.json

const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");

const app = express();
const PORT = 3000;

// Para poder leer JSON del body
app.use(express.json());
app.use(cors());

// Ruta del archivo donde guardamos los productos
const FILE_PATH = "./productos.json";

// 📌 Leer archivo JSON
async function readProducts() {
    try {
        const data = await fs.readFile(FILE_PATH, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// 📌 Guardar archivo JSON
async function saveProducts(products) {
    await fs.writeFile(FILE_PATH, JSON.stringify(products, null, 2));
}

// ----------------------
// RUTAS API
// ----------------------

// Obtener todos los productos
app.get("/productos", async (req, res) => {
    const products = await readProducts();
    res.json(products);
});

// Agregar producto
app.post("/productos", async (req, res) => {
    const products = await readProducts();
    const newProduct = req.body;

    // Generar ID simple
    newProduct.id = Date.now();

    products.push(newProduct);
    await saveProducts(products);

    res.json({ message: "Producto agregado", product: newProduct });
});

// Actualizar STOCK
app.put("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const products = await readProducts();

    const product = products.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    product.quantity = req.body.quantity;

    await saveProducts(products);
    res.json({ message: "Stock actualizado", product });
});

// ELIMINAR producto
app.delete("/productos/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    let products = await readProducts();

    products = products.filter(p => p.id !== id);

    await saveProducts(products);
    res.json({ message: "Producto eliminado" });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log("Servidor corriendo en http://localhost:" + PORT);
});
