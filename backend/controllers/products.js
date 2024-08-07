const productsRouter = require('express').Router()
const Product = require('../models/product')

productsRouter.get('/', (request, response) => {  // retrieve
    Product.find({}).then(products => {
      response.json(products)
    })
})
  
  
productsRouter.get('/:id', (request, response) => {   // retrieve
    Product.findById(request.params.id).then(product => {
        if (product) {
            response.json(product)
        }
        else {
            response.status(404).end()
        }
    })
})
  
productsRouter.post('/', (request, response) => {   // create
    const body = request.body
  
    if (!body.content) {
        return response.status(400).json({
            error: 'missing fields'
        })
    }
  
    const product = new Product({
        name: body.name,
        price: body.price,
        quantity: body.quantity
    })
          
    product.save().then(savedProduct => {
        response.json(savedProduct)
    })
})
  
productsRouter.delete('/:id', (request, response) => {  // delete
    Product.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})
  
productsRouter.put('/:id', (request, response) => {  // update
    const body = request.body
  
    const product = {
        name: body.name,
        price: body.price,
        quantity: body.quantity
    }
  
    Product.findByIdAndUpdate(request.params.id, product, {new: true})
        .then(updatedProduct => {
            response.json(updatedProduct)
        })
})

module.exports = productsRouter