require('dotenv').config()
const express = require('express')
const searchRouter = express.Router()
const xss = require('xss')
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

searchRouter
    .route('/term')
    .get((req, res, next) => {
        const db = req.app.get('db')
        const { city, category } = req.query

        if(!city){
            return res.status(400).json({ error: {message: 'City name must be included'}})
        }

        if(!category){
            let search = { city }
            let searchReq = search.city
            SearchReviewsService.getBySearchTerm(db, searchReq)
                .then(reviews => {
                    if(!reviews.length) {
                        return res.status(404).json({ 
                            error: { message: 'City has not been reviewed yet' }
                        })
                    }
                    res.json(reviews.map(sanitizeReviews))
                })
                .catch(next)

        } else {
            req_city = { city }
            req_cat = { category }
            
            search_city = req_city.city
            search_cat = req_cat.category
            
            SearchReviewsService.getBySearchTermAndCategory(db, search_city, search_cat)
                .then(reviews => {
                    if(!reviews.length) {
                        return res.status(404).json({ 
                            error: { message: 'City with category has not been reviewed yet' }
                        })
                    }
                    res.json(reviews.map(sanitizeReviews))
                })
                .catch(next)
        }
    })
    
module.exports = searchRouter