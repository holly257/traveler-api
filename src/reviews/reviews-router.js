require('dotenv').config();
const express = require('express');
const reviewsRouter = express.Router();
const xss = require('xss');
const path = require('path');
const jsonParser = express.json();
const ReviewsService = require('./reviews-service');
const { requireAuth } = require('../middleware/jwt-auth');

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
    user_id: review.user_id,
});

reviewsRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const db = req.app.get('db');
        const user_id = req.user.id;

        ReviewsService.getAllReviewsForUser(db, user_id)
            .then(reviews => {
                res.json(reviews.map(sanitizeReviews));
            })
            .catch(next);
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const {
            name,
            image,
            image_alt,
            city,
            country,
            address,
            rating,
            category,
            comments,
        } = req.body;
        const user_id = req.user.id;
        const newReview = {
            name,
            image,
            image_alt,
            city,
            country,
            address,
            rating,
            category,
            comments,
            user_id,
        };

        const required = {
            name,
            city,
            country,
            rating,
            category,
            comments,
            user_id,
            image,
        };
        for (const [key, value] of Object.entries(required)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body` },
                });
            }
        }

        ReviewsService.insertReview(db, newReview)
            .then(review => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${review.id}`))
                    .json(sanitizeReviews(review));
            })
            .catch(next);
    });

reviewsRouter
    .route('/:review_id')
    .all(requireAuth)
    .all((req, res, next) => {
        const db = req.app.get('db');
        const id = req.params.review_id;

        ReviewsService.getById(db, id)
            .then(review => {
                if (!review) {
                    return res.status(404).json({
                        error: { message: 'Review does not exist' },
                    });
                }
                res.review = review;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(sanitizeReviews(res.review));
    })
    .patch(jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const {
            id,
            name,
            image,
            image_alt,
            city,
            country,
            address,
            rating,
            category,
            comments,
        } = req.body;
        const editedReview = {
            id,
            name,
            image,
            image_alt,
            city,
            country,
            address,
            rating,
            category,
            comments,
        };

        const numValues = Object.values(editedReview).filter(Boolean).length;
        //user can only click edit if review exists - so every edit will at least have an id
        if (numValues === 1) {
            return res.status(400).json({
                error: { message: 'Request body must contain value to update' },
            });
        }

        ReviewsService.updateReview(db, id, editedReview)
            .then(review => {
                res.status(201).json(sanitizeReviews(review[0]));
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        const db = req.app.get('db');
        const id = req.params.review_id;

        ReviewsService.deleteReview(db, id)
            .then(review => res.status(204).end())
            .catch(next);
    });

module.exports = reviewsRouter;
