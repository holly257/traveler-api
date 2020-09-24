const Treeize = require('treeize');

const ReviewsService = {
    getAllReviewsForUser(db, user_id) {
        return db.from('reviews').select('*').where('user_id', user_id);
    },

    insertReview(db, newReview) {
        return db
            .insert(newReview)
            .into('reviews')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },

    getById(db, id) {
        return db.from('reviews').select('*').where('id', id).first();
    },

    deleteReview(db, id) {
        return db('reviews').where({ id }).delete();
    },

    updateReview(db, id, newReviewInfo) {
        return db('reviews').where({ id }).update(newReviewInfo).returning('*');
    },

    getAllBookmarksForUser(db, user_id) {
        return db
            .from('bookmarks')
            .select(
                'bookmarks.user_id AS user_id',
                'bookmarks.review_id AS review_id',
                'reviews.id',
                'reviews.name',
                'reviews.image',
                'reviews.image_alt',
                'reviews.city',
                'reviews.country',
                'reviews.address',
                'reviews.rating',
                'reviews.category',
                'reviews.comments',
                'reviews.date_created',
                'reviews.user_id AS reviewer_id'
            )
            .where('bookmarks.user_id', user_id)
            .leftJoin('reviews', 'bookmarks.review_id', 'reviews.id')
            .then(data => {
                let tree = new Treeize();
                return tree.grow(data).getData();
            });
    },

    insertBookmark(db, newBookmark) {
        return db
            .insert(newBookmark)
            .into('bookmarks')
            .returning('*')
            .then(rows => {
                return rows[0];
            });
    },
};

module.exports = ReviewsService;
