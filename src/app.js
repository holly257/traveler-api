require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const reviewsRouter = require('./reviews/reviews-router')
const searchRouter = require('./search/search-router')
const authRouter = require('./auth/auth-router')
const tripsRouter = require('./trips/trips-router')
const daysRouter = require('./days/days-router')
const activitiesRouter = require('./activities/activities-router')
const usersRouter = require('./users/users-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
// app.use(cors({ origin: CLIENT_ORIGIN }))

//only reviews router is protected right now
//maybe have search router, unprotected, only does review get request

app.use('/api/search', searchRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/auth', authRouter)

app.use('/api/users', usersRouter)
app.use('/api/trips', tripsRouter)

app.use('/api/trips', daysRouter)
app.use('/api/trips', activitiesRouter)

app.get('/', (req, res) => {
    res.send('Hello Traveler')
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app