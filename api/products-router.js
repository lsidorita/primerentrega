const express = require('express')
const fs = require('fs')
const router = express.Router()
const productsFilePath = './data/products.json'
const readProducts = () => JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

// Ruta GET / - Listar todos los productos
router.get('/', (req, res) => {
  const products = readProducts();
  const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.json(products.slice(0, limit));
});

// Ruta GET /:pid - Obtener un producto por su ID
router.get('/:pid', (req, res) => {
  const products = readProducts();
  const product = products.find(p => p.id === req.params.pid);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta POST / - Agregar un nuevo producto
router.post('/', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: (products.length + 1).toString(),  // Generación de ID simple
    ...req.body,
    status: req.body.status !== undefined ? req.body.status : true
  };

  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || newProduct.stock === undefined || !newProduct.category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
  }

  products.push(newProduct);
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
  res.status(201).json(newProduct);
});
// Ruta PUT /:pid - Actualizar un producto por su ID
router.put('/:pid', (req, res) => {
    let products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
  
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    const updatedProduct = { ...products[productIndex], ...req.body };
    if (req.body.id) {
      delete req.body.id; // No permitir la actualización del ID
    }
  
    products[productIndex] = updatedProduct;
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json(updatedProduct);
  });
  
  // Ruta DELETE /:pid - Eliminar un producto por su ID
  router.delete('/:pid', (req, res) => {
    let products = readProducts();
    const productIndex = products.findIndex(p => p.id === req.params.pid);
  
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
  
    products.splice(productIndex, 1);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(204).send();
  });
  
  module.exports = router;