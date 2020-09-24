require('dotenv').config();
const express = require('express');
const bookmarksRouter = express.Router();
const path = require('path');
const xss = require('xss');
const jsonParser = express.json();
const BookmarksService = require('./bookmarks-service');
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

bookmarksRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const db = req.app.get('db');
        const user_id = req.user.id;

        BookmarksService.getAllBookmarksForUser(db, user_id)
            .then(bookmarks => {
                res.json(bookmarks.map(sanitizeReviews));
            })
            .catch(next);
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const review_id = req.body.id;
        const user_id = req.user.id;

        let new_bookmark = {
            review_id,
            user_id,
        };

        BookmarksService.insertBookmark(db, new_bookmark)
            .then(bookmark => {
                res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
                    .json(bookmark);
            })
            .catch(next);
    });

bookmarksRouter.route('/:bookmark_id').delete(requireAuth, (req, res, next) => {
    const db = req.app.get('db');
    const id = req.params.bookmark_id;

    BookmarksService.deleteBookmark(db, id)
        .then(review => res.status(204).end())
        .catch(next);
});

module.exports = bookmarksRouter;
