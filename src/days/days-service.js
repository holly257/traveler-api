const DaysService = {
    // getAllDays(db, trip_id) {
    //     return db.select('*').from('days')
    //         .where('trip_id', trip_id)
    // },

    insertDay(db, id) {
        return db.insert({'trip_id': id}).into('days')
            .returning('*').then(rows => {
                return rows[0]
            })
    },

    // getById(db, id) {
    //     return db.from('activities').select('*')
    //         .where('id', id).first()
    // },

    // deleteDay(db, id) {
    //     return db('days').where({ id }).delete()
    // },

    // updateDay(db, id, newDayInfo) {
    //     return db('days').where({ id }).update(newDayInfo)
    // },
}

module.exports = DaysService