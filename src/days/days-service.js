const DaysService = {
    insertDay(db, id) {
        return db.insert({'trip_id': id}).into('days')
            .returning('*').then(rows => {
                return rows[0]
            })
    },

    // deleteDay(db, id) {
    //     return db('days').where({ id }).delete()
    // },

}

module.exports = DaysService