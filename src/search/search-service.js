const SearchReviewsService = {
    getFirstReviews(db) {
        return db.select('*').from('reviews').limit(10)
    },

    // getBySearch(db, search) {
    //     return db.from('reviews').select('*')
    //         .where('id', id).first()
    // },

}

module.exports = SearchReviewsService