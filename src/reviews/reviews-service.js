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
        return db('reviews').where({ id }).update(newReviewInfo);
    },
};

module.exports = ReviewsService;
