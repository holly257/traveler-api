require('dotenv').config()
const express = require('express')
const usersRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const UsersService = require('./users-service')

const sanitizeUsers = user => ({
    username: xss(user.username),
    password: xss(user.password), 
    email: xss(user.email), 
    fullname: xss(user.fullname)
})

//work in progress - need tests 
usersRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const db = req.app.get('db')
        const { fullname, password, username, email } =  req.body
        const newUser = { fullname, password, username, email }

        for(const [key, value] of Object.entries(newUser)) {
            if (value ==  null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body`}
                })
            }
        }

        UsersService.insertUser(db, newUser)
            .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(sanitizeUsers(user))
            })
            .catch(next)
    })

module.exports = usersRouter