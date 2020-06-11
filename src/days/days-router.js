require('dotenv').config()
const express = require('express')
const daysRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const DaysService = require('./days-service')

daysRouter
    .route('/:trip_id/days')
    .get((req, res, next) => {
        const db = req.app.get('db')
        const trip_id = req.params.trip_id
        console.log(trip_id)

        // if(typeof trip_id == 'number') {
        //     return res.status(400).json({ error: { message: 'Trip id must be a number' }})
        // }

        DaysService.getAllDays(db, trip_id)
            .then(days => {
                // if(!days) {
                //     return res.status(404).json({ 
                //         error: { message: 'trip does not exist' }
                //     })
                // }
                res.json(days)
            })
            .catch(next)
    })

module.exports = daysRouter