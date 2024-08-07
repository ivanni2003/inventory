const express = require('express')
const app = express()
const productsRouter = require('./controllers/products')
const usersRouter = require('./controllers/users')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = 'mongodb+srv://ivanni2003:Luckace34-@inventorycluster.5cwsxk5.mongodb.net/inventoryApp?retryWrites=true&w=majority&appName=inventoryCluster'
mongoose.connect(url)

app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)

module.exports = app