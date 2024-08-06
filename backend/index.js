const express = require('express')
const app = express()
const mongoose = require('mongoose')

app.use(express.json())

const url = 'mongodb+srv://ivanni2003:Luckace34-@inventorycluster.5cwsxk5.mongodb.net/inventoryApp?retryWrites=true&w=majority&appName=inventoryCluster'

mongoose.set('strictQuery',false)
mongoose.connect(url)

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    quantity: Number
})

productSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

const Product = mongoose.model('Product', productSchema)

app.get('/api/products', (request, response) => {  // retrieve
  Product.find({}).then(products => {
    response.json(products)
  })
})


app.get('/api/products/:id', (request, response) => {   // retrieve
    Product.findById(request.params.id).then(product => {
        if (product) {
            response.json(product)
        }
        else {
            response.status(404).end()
        }
    })
})

app.post('/api/products', (request, response) => {   // create
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

app.delete('/api/products/:id', (request, response) => {  // delete
    Product.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

app.put('/api/products/:id', (request, response) => {  // update
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})