const SearchReviewsService = {
    getFirstReviews(db) {
        return db.select('*').from('reviews').limit(10)
    },

    getBySearchTerm(db, searchTerm) {
        return db.select('*').from('reviews')
            .where('city', 'like', `%${searchTerm}%`)
    },

    getBySearchTermAndCategory(db, searchTerm, searchCat) {
        return db.select('*').from('reviews')
            .where('city', 'like', `%${searchTerm}%`)
            .where('category', searchCat)
    },

}

module.exports = SearchReviewsService