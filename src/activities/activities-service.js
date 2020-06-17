const ActivitiesService = {
    getAllActivities(db, day_id) {
        return db.select('*').from('activities')
        .where('day_id', day_id)
    },

    insertActivity(db, newActivity) {
        return db.insert(newActivity).into('activities')
            .returning('*').then(rows => {
                return rows[0]
            })
    },

    getById(db, activity_id) {
        return db.from('activities').select('*')
            .where('id', activity_id).first()
            
    },

    

    // deleteActivity(db, id) {
    //     return db('activities').where({ id }).delete()
    // },

    updateActivity(db, id, newActivityInfo) {
        return db('activities').where({ id }).update(newActivityInfo)
    },
}

module.exports = ActivitiesService