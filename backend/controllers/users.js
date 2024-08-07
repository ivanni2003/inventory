const User = require('../models/user')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const { username, password } = request.body

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
    User.find({}).then(users => {
        response.json(users)
    })

})

module.exports = usersRouter