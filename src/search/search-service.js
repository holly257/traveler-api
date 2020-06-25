const SearchReviewsService = {
    getFirstReviews(db) {
        return db.select('*').from('reviews').limit(10)
    },

    getBySearchTerm(db, searchTerm) {
        return db.select('*').from('reviews')
            .whereRaw(`LOWER(city) LIKE ?`, [`%${searchTerm.toLowerCase()}%`])
    },

    getBySearchTermAndCategory(db, searchTerm, searchCat) {
        return db.select('*').from('reviews')
            .whereRaw(`LOWER(city) LIKE ?`, [`%${searchTerm.toLowerCase()}%`])
            .where('category', searchCat)
    },

}

module.exports = SearchReviewsService