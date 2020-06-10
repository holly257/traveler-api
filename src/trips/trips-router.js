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
    // .post(jsonParser, (req, res, next) => {
    //     const db = req.app.get('db')
    //     const { name, image, image_alt, city, country, address, rating, category, comments, user_id } =  req.body
    //     const newReview = { name, image, image_alt, city, country, address, rating, category, comments, user_id }

    //     const required = { name, city, country, rating, category, comments, user_id }

    //         for(const [key, value] of Object.entries(required)) {
    //             if (value ==  null) {
    //                 return res.status(404).json({
    //                     error: { message: `Missing ${key} in request body`}
    //                 })
    //             }
    //         }

    //     ReviewsService.insertReview(db, newReview)
    //         .then(review => {
    //             res
    //                 .status(201)
    //                 .location(path.posix.join(req.originalUrl, `/${review.id}`))
    //                 .json(sanitizeReviews(review))
    //         })
    //         .catch(next)
    // })


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

module.exports = tripsRouter