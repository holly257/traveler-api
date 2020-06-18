require('dotenv').config()
const express = require('express')
const daysRouter = express.Router()
const path = require('path')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')
const DaysService = require('./days-service')

daysRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const db = req.app.get('db')

        DaysService.getAllDays(db)
            .then(days => {
                res.json(days)
            })
            .catch(next)
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const db = req.app.get('db')
        const trip_id = req.body.trip_id

        if(!trip_id){
            return res.status(400).json({ error: { message: 'Missing trip_id in request body'}})
        }

        DaysService.insertDay(db, trip_id)
            .then(days => {
                if(!days) {
                    return res.status(404).json({ 
                        error: { message: 'Trip does not exist' }
                    })
                }
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${days.id}`))
                    .json(days)
            })
            .catch(next)
    })

daysRouter
    .route('/:day_id')
    .delete(requireAuth, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.day_id

        DaysService.deleteDay(db, id)
            .then(day => {
                if(!day) {
                    return res.status(404).json({
                        error: { message: 'Day does not exist'}
                    })
                }
                res.status(204).end()
            })
            .catch(next)
    })
    
module.exports = daysRouter