const User = require('../models/user')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const {username, password} = request.body

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username: username,
      passwordHash: passwordHash,
    })
  
    user.save().then(savedUser => {
        response.json(savedUser)
    })
  
})
  
usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('products', { name: 1, category: 1, price: 1, quantity: 1 })

  response.json(users)
})

usersRouter.delete('/:id', (request, response) => {
    User.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
})

module.exports = usersRouter