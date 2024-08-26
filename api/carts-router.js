const express = require('express');
const fs = require('fs');
const router = express.Router();
const cartsFilePath = './data/carts.json';
const productsFilePath = './data/products.json';

const readCarts = () => JSON.parse(fs.readFileSync(cartsFilePath, 'utf-8'));
const readProducts = () => JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

// Ruta POST / - Crear un nuevo carrito
router.post('/', (req, res) => {
  const carts = readCarts();
  const newCart = {
    id: (carts.length + 1).toString(),  // Generación de ID simple
    products: []
  };

  carts.push(newCart);
  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
  res.status(201).json(newCart);
});

// Ruta GET /:cid - Listar productos de un carrito
router.get('/:cid', (req, res) => {
  const carts = readCarts();
  const cart = carts.find(c => c.id === req.params.cid);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Ruta POST /:cid/product/:pid - Agregar un producto al carrito
router.post('/:cid/product/:pid', (req, res) => {
  const carts = readCarts();
  const products = readProducts();
  const cart = carts.find(c => c.id === req.params.cid);
  const product = products.find(p => p.id === req.params.pid);

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  const cartProduct = cart.products.find(p => p.product === req.params.pid);

  if (cartProduct) {
    cartProduct.quantity += 1;
  } else {
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
  res.json(cart);
});

module.exports = router;