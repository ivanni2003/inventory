const User = require('../models/user')
const productsRouter = require('express').Router()
const Product = require('../models/product')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

productsRouter.get('/', async (request, response) => {  // retrieve
    const products = await Product
        .find({}).populate('user', { username: 1 })

  response.json(products)
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
  
productsRouter.post('/', async (request, response) => {   // create
    const body = request.body

    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    //const user = await User.findById("66b515ec1f0d53f44ad4def9")
   /* if (!body.content) {
        return response.status(400).json({
            error: 'missing fields'
        })
    }*/
  
    const product = new Product({
        name: body.name,
        category: body.category,
        price: body.price,
        quantity: body.quantity,
        user: user.id
    })
          
    const savedProduct = await product.save()

    user.products = user.products.concat(savedProduct._id)
    await user.save()

    response.json(savedProduct)
})
  
productsRouter.delete('/:id', async (request, response) => {  // delete
    Product.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})
  
productsRouter.put('/:id', async (request, response) => {  // update
    const body = request.body
  
    const product = {
        name: body.name,
        category: body.category,
        price: body.price,
        quantity: body.quantity
    }

    Product.findByIdAndUpdate(request.params.id, product, {new: true})
        .then(updatedProduct => {
            response.json(updatedProduct)
        })
})

module.exports = productsRouter