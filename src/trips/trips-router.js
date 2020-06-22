require('dotenv').config()
const express = require('express')
const tripsRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')
const TripsService = require('./trips-service')

const sanitizeTrips = trip => ({
    id: trip.id,
    name: xss(trip.name),
    city: xss(trip.city), 
    country: xss(trip.country),
    user_id: trip.user_id,
})

tripsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const db = req.app.get('db')
        const user_id = req.user.id

        TripsService.getWholeTripsForUser(db, user_id)
            .then(trips => {
                res.json(trips)
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const db = req.app.get('db')
        const { name, city, country } =  req.body
        const user_id = req.user.id
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

tripsRouter
    .route('/:trip_id')
    .delete(requireAuth, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.trip_id

        TripsService.deleteTrip(db, id)
            .then(trip =>{ 
                if(!trip) {
                    return res.status(404).json({
                        error: { message: 'Trip does not exist'}
                    })
                }
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(requireAuth, jsonParser, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.trip_id
        console.log('hello')
        const { name, city, country} =  req.body
        const updatedTrip = { name, city, country }

        const numValues = Object.values(updatedTrip).filter(Boolean).length
        if (numValues === 0) {
            return res.status(400).json({
                error: { message: 'Request body must contain value to update'}
            })
        }
        TripsService.updateTrip(db, id, updatedTrip)
            .then(trip => {
                if(!trip) {
                    
                    return res.status(404).json({
                        error: { message: 'Trip does not exist'}
                    })
                }
                res
                    .status(204).end()
            })
            .catch(next)
    })


module.exports = tripsRouter