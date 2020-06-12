const ReviewsService = {
    getAllReviews(db) {
        return db.select('*').from('reviews')
    },

    insertReview(db, newReview) {
        return db.insert(newReview).into('reviews')
            .returning('*').then(rows => {
                return rows[0]
            })
    },

    getById(db, id) {
        return db.from('reviews').select('*')
            .where('id', id).first()
    },

    deleteReview(db, id) {
        return db('reviews').where({ id }).delete()
    },
}

module.exports = ReviewsService