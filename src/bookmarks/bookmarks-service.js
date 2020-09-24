const Treeize = require('treeize');

const BookmarksService = {
    getAllBookmarksForUser(db, user_id) {
        return db
            .from('bookmarks')
            .select(
                'bookmarks.user_id AS user_id',
                'bookmarks.review_id AS review_id',
                'bookmarks.id AS id',
                'reviews.id AS review_id',
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

    deleteBookmark(db, id) {
        return db('bookmarks').where({ id }).delete();
    },
};

module.exports = BookmarksService;
