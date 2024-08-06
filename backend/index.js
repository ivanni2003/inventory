const express = require('express')
const app = express()

app.use(express.json())

let products = [
    {
      id: "1",
      name: "Mouse",
      price: 10,
      quantity: 10
    },
    {
        id: "2",
        name: "Keyboard",
        price: 20,
        quantity: 10
    },
    {
        id: "3",
        name: "Monitor",
        price: 50,
        quantity: 10
    }
    
  ]
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/products', (request, response) => {  // retrieve
  response.json(products)
})

app.get('/api/products/:id', (request, response) => {   // retrieve
    const id = request.params.id
    const product = products.find(product => product.id === id)
    response.json(product)

    if (product) {
        response.json(product)
    }
    else {
        response.status(404).end()
    }
})

app.delete('/api/products/:id', (request, response) => {  // delete
    const id = request.params.id
    products = products.filter(product => product.id !== id)
  
    response.status(204).end()
})

app.post('/api/products', (request, response) => {   // create
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'missing fields'
        })
    }

    const product = {
        id: String(products.length + 1),
        name: body.name,
        price: body.price,
        quantity: body.quantity
    }

    products = products.concat(product)
    response.json(product)
})

app.put('/api/products/:id', (request, response) => {  // update
    const id = request.params.id
    const updatedProduct = {
        id: "1",
        name: "hello",
        price: 100,
        quantity: 20
    };

    const productIndex = products.findIndex(product => product.id === id)

    if (productIndex === -1) {
        return response.status(404).json({
            error: 'product not found'
        })
    }
  
    products[productIndex] = { ...products[productIndex], ...updatedProduct }
    response.json(products[productIndex])
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})