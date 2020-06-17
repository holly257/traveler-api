require('dotenv').config()
const express = require('express')
const activitiesRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const ActivitiesService = require('./Activities-service')
const { requireAuth } = require('../middleware/jwt-auth')


const sanitizeActivities = activity => ({
    id: activity.id,
    activity: xss(activity.activity),
    meridiem: activity.meridiem,
    start_time: activity.start_time,
    day_id: activity.day_id
})

activitiesRouter
    .route('/')
    // .route('/:trip_id/days/:day_id/activities')
    .all(requireAuth)
    .get((req, res, next) => {
        const db = req.app.get('db')
        const day_id = req.params.day_id

        ActivitiesService.getAllActivities(db, day_id)
            .then(activities => {
                res.json(activities.map(sanitizeActivities))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const db = req.app.get('db')
        const { activity, meridiem, start_time, day_id } =  req.body
        
        const newactivity = { activity, meridiem, start_time, day_id }

        for(const [key, value] of Object.entries(newactivity)) {
            if (value ==  null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body`}
                })
            }
        }
        console.log(newactivity)

        ActivitiesService.insertActivity(db, newactivity)
            .then(activity => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${activity.id}`))
                    .json(sanitizeActivities(activity))
            })
            .catch(next)
    })

activitiesRouter
    .route('/:activity_id')
    // .route('/:trip_id/days/:day_id/activities/:activity_id')
    .all(requireAuth, (req, res, next) => {
        const db = req.app.get('db')
        const activity_id = req.params.activity_id
        const day_id = req.params.day_id
        console.log(day_id, activity_id)

        ActivitiesService.getById(db, activity_id)
            .then(activity => {
                //not working
                if(!activity.day_id === day_id) {
                    return res.status(404).json({
                        error: { message: 'Activity does not exist'}
                    })
                }
                res.activity = activity
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(sanitizeActivities(res.activity))
    })
//     .delete((req, res, next) => {
//         const db = req.app.get('db')
//         const id = req.params.activity_id

//         ActivitiesService.deleteActivity(db, id)
//             .then(activity =>
//                 res.status(204).end()
//             )
//             .catch(next)
//     })
//     .patch(jsonParser, (req, res, next) => {
//         const db = req.app.get('db')
//         const id = req.params.activity_id

//         const { name, city, country} =  req.body
//         const updatedactivity = { name, city, country }

//         const numValues = Object.values(updatedactivity).filter(Boolean).length
//         if (numValues === 0) {
//             return res.status(400).json({
//                 error: { message: 'Request body must contain value to update'}
//             })
//         }

//         ActivitiesService.updateActivity(db, id, updatedactivity)
//             .then(activity => {
//                 res
//                     .status(204).end()
//             })
//             .catch(next)
//     })


module.exports = activitiesRouter