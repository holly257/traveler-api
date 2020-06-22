const express = require('express')
const authRouter = express.Router()
const jsonParser = express.json()
const AuthService = require('./auth-service')

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const { username, password } = req.body
        const loginUser = { username, password }
        
        for(const [key, value] of Object.entries(loginUser))    
            if(value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })

        AuthService.getUserWithUsername(
            req.app.get('db'),
            loginUser.username
        )
        .then(dbUser => {
            if(!dbUser)
                return res.status(400).json({
                    error: 'Incorrect username or password'
                })
            return AuthService.comparePasswords(loginUser.password, dbUser.password)
                .then(compareMatch => {
                    if(!compareMatch)
                        return res.status(400).json({
                            error: 'Incorrect username or password'
                        })
                        const sub = dbUser.username
                        const payload = { user_id: dbUser.id }

                        const token = AuthService.createJwt(sub, payload)
                                                 
                        res.send({
                            authToken: token
                        })
                })
        })
        .catch(next)

    })

module.exports = authRouter