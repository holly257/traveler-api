require('dotenv').config()
const express = require('express')
const tripsRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const TripsService = require('./trips-service')

const sanitizeTrips = trip => ({
    id: trip.id,
    name: xss(trip.name),
    city: xss(trip.city), 
    country: xss(trip.country),
    date_created: trip.date_created,
    user_id: trip.user_id
})

tripsRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db')

        TripsService.getAllTrips(db)
            .then(trips => {
                console.log(trips)
                res.json(trips.map(sanitizeTrips))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const db = req.app.get('db')
        const { name, city, country, user_id } =  req.body
        const newTrip = { name, city, country, user_id }

        for(const [key, value] of Object.entries(newTrip)) {
            if (value ==  null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body`}
                })
            }
        }

        TripsService.insertTrip(db, newTrip)
            .then(trip => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${trip.id}`))
                    .json(sanitizeTrips(trip))
            })
            .catch(next)
    })

    //need tests for post


tripsRouter
    .route('/:trip_id')
    .all((req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.trip_id

        TripsService.getById(db, id)
            .then(trip => {
                if(!trip) {
                    return res.status(404).json({
                        error: { message: 'Trip does not exist'}
                    })
                }
                res.trip = trip
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(sanitizeTrips(res.trip))
    })
    .delete((req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.trip_id

        TripsService.deleteTrip(db, id)
            .then(trip =>
                res.status(204).end()
            )
            .catch(next)
    })


module.exports = tripsRouter