const Treeize = require('treeize')
const xss = require('xss')

const TripsService = {
    getAllTrips(db) {
        return db.select('*').from('trips')
        // return db.from('trips').select('trips.id AS id', 'trips.name AS name', 'trips.city AS city', 'trips.country AS country', 
        //     'days.id AS days:days_id', 'days.trip_id AS days:trip_id', 'activities.activity AS days:activities:activity', 'activities.meridiem AS days:activities:meridiem', 
        //     'activities.start_time AS days:activities:start_time', 'activities.day_id AS days:activities:day_id')
        //     .leftJoin('days', 'trips.id', 'days.trip_id')
        //     .leftJoin('activities', 'days.id', 'day_id')
        //     .then(data => {
        //         console.log(data)
        //         let tree = new Treeize()
        //         return tree.grow(data).getData()
        //     })
    },

    getAllTripsForUser(db, user_id) {
        return db.select('*').from('trips')
            .where('user_id', user_id)
    },

    insertTrip(db, newTrip) {
        return db.insert(newTrip).into('trips')
            .returning('*').then(rows => {
                return rows[0]
            })
    },

    getWholeTripById(db, id) {
        return db.from('trips').select('trips.id AS id', 'trips.name AS name', 'trips.city AS city', 'trips.country AS country', 
            'days.id AS days:days_id', 'days.trip_id AS days:trip_id', 'activities.id AS days:activities:id', 'activities.activity AS days:activities:activity', 'activities.meridiem AS days:activities:meridiem', 
            'activities.start_time AS days:activities:start_time', 'activities.day_id AS days:activities:day_id')
            .where('trips.id', id)
            .leftJoin('days', 'trips.id', 'days.trip_id')
            .leftJoin('activities', 'days.id', 'day_id')
            .then(data => {
                let tree = new Treeize()
                return tree.grow(data).getData()
            })
        // return db.from('trips').select('*')
        //     .where('id', id).first()
    },

    deleteTrip(db, id) {
        return db('trips').where({ id }).delete()
    },

    updateTrip(db, id, newTripInfo) {
        return db('trips').where({ id }).update(newTripInfo)
    },
}

module.exports = TripsService