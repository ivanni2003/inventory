const express = require('express')
const app = express()
const productsRouter = require('./controllers/products')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const cors = require('cors');

mongoose.set('strictQuery',false)

const url = process.env.MONGODBURI
mongoose.connect(url)

app.use(express.json())
app.use(cors());

app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app