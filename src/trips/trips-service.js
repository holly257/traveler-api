const TripsService = {
    getAllTrips(db) {
        return db.select('*').from('trips')
    },

    // insertTrip(db, newTrip) {
    //     return db.insert(newTrip).into('trips')
    //         .returning('*').then(rows => {
    //             return rows[0]
    //         })
    // },

    getById(db, id) {
        return db.from('trips').select('*')
            .where('id', id).first()
    },

    // deleteTrip(db, id) {
    //     return db('trips').where({ id }).delete()
    // },

    // updateTrip(db, id, newTripInfo) {
    //     return db('trips').where({ id }).update(newTripInfo)
    // },
}

module.exports = TripsService