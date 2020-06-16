const SearchReviewsService = {
    getFirstReviews(db) {
        return db.select('*').from('reviews').limit(10)
    },

    getBySearchTerm(db, searchTerm) {
        return db.select('*').from('reviews')
            // .where('city', 'like', `%Mostar%`)
            .where('city', 'like', `%${searchTerm}%`)
    },

    getBySearchTermAndCategory(db, searchTerm, category) {
        // return db.from('reviews').select('*')
        //     .where('id', id).first()
    },

}

module.exports = SearchReviewsService