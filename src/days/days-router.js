require('dotenv').config()
const express = require('express')
const daysRouter = express.Router()
const xss = require('xss')
const path = require('path')
const jsonParser = express.json()
const { requireAuth } = require('../middleware/jwt-auth')
const DaysService = require('./days-service')

//need to write tests for this
daysRouter
    .route('/')
    .post(requireAuth, jsonParser, (req, res, next) => {

        const db = req.app.get('db')
        const trip_id = req.body.trip_id

        if(!trip_id){
            return res.status(400).json({ error: { message: 'Missing trip id'}})
        }

        DaysService.insertDay(db, trip_id)
        
            .then(days => {
                
                if(!days) {
                    return res.status(404).json({ 
                        error: { message: 'trip does not exist' }
                    })
                }
                res
                    .status(201).end()
            })
            .catch(next)
    })

module.exports = daysRouter