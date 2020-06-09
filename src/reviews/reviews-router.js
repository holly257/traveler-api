require('dotenv').config()
const express = require('express')
const reviewsRouter = express.Router()
const xss = require('xss')
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
                console.log(reviews)
                res.json(reviews.map(sanitizeReviews))
            })
            .catch(next)
})

module.exports = reviewsRouter