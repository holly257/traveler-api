require('dotenv').config()
const express = require('express')
const reviewsRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const ReviewsService = require('./reviews-service')

const sanitizeReviews = review => ({
    id: review.id,
    name: xss(review.name),
    //will that work on image url?
    //not testing with xss in image - not sure how
    image: xss(review.image), 
    image_alt: xss(review.image_alt), 
    city: xss(review.city), 
    country: xss(review.country), 
    date_created: review.date_created,
    address: xss(review.address), 
    rating: review.rating, 
    category: review.category, 
    comments: xss(review.comments), 
    user_id: review.user_id
})

reviewsRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db')

        ReviewsService.getAllReviews(db)
            .then(reviews => {
                res.json(reviews.map(sanitizeReviews))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const db = req.app.get('db')
        console.log(req.body)
        const { name, image, image_alt, city, country, address, rating, category, comments, user_id } =  req.body
        const newReview = { name, image, image_alt, city, country, address, rating, category, comments, user_id }
        
        const required = { name, city, country, rating, category, comments, user_id }

            for(const [key, value] of Object.entries(required)) {
                if (value ==  null) {
                    return res.status(400).json({
                        error: { message: `Missing ${key} in request body`}
                    })
                }
            }

        ReviewsService.insertReview(db, newReview)
            .then(review => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${review.id}`))
                    .json(sanitizeReviews(review))
            })
            .catch(next)
    })


reviewsRouter
    .route('/:review_id')
    .all((req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.review_id

        ReviewsService.getById(db, id)
            .then(review => {
                if(!review) {
                    return res.status(404).json({
                        error: { message: 'Review does not exist'}
                    })
                }
                res.review = review
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(sanitizeReviews(res.review))
    })
    .delete((req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.review_id

        ReviewsService.deleteReview(db, id)
            .then(review =>
                res.status(204).end()
            )
            .catch(next)
    })

module.exports = reviewsRouter