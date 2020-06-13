require('dotenv').config()
const express = require('express')
const searchRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const SearchReviewsService = require('./search-service')

const sanitizeReviews = review => ({
    id: review.id,
    name: xss(review.name),
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

searchRouter
    .route('/')
    .get((req, res, next) => {
        const db = req.app.get('db')

        SearchReviewsService.getFirstReviews(db)
            .then(reviews => {
                res.json(reviews.map(sanitizeReviews))
            })
            .catch(next)
    })
    
module.exports = searchRouter