const express = require('express')
const app = express();
const productRouter = require('./api/products-router')
const cartsRouter = require('./api/carts-router')
app.use(express.json())
app.use('/api/products', productRouter)
app.use('/api/carts', cartsRouter)
app.listen(8080, ()=> {
    console.log('servidor escuchando en el puerto 8080')
})