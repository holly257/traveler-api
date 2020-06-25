require('dotenv').config();
const express = require('express');
const activitiesRouter = express.Router();
const xss = require('xss');
const path = require('path');
const jsonParser = express.json();
const ActivitiesService = require('./activities-service');
const { requireAuth } = require('../middleware/jwt-auth');

const sanitizeActivities = activity => ({
    id: activity.id,
    activity: xss(activity.activity),
    meridiem: activity.meridiem,
    start_time: activity.start_time,
    day_id: activity.day_id,
});

activitiesRouter
    .route('/')
    .all(requireAuth)
    .get((req, res, next) => {
        const db = req.app.get('db');

        ActivitiesService.getAllActivities(db)
            .then(activities => {
                res.json(activities.map(sanitizeActivities));
            })
            .catch(next);
    })
    .post(jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const { activity, meridiem, start_time, day_id } = req.body;
        const newactivity = { activity, meridiem, start_time, day_id };

        for (const [key, value] of Object.entries(newactivity)) {
            if (value == null) {
                return res.status(400).json({
                    error: { message: `Missing ${key} in request body` },
                });
            }
        }

        ActivitiesService.insertActivity(db, newactivity)
            .then(activity => {
                res.status(201)
                    .location(
                        path.posix.join(req.originalUrl, `/${activity.id}`)
                    )
                    .json(sanitizeActivities(activity));
            })
            .catch(next);
    });

activitiesRouter
    .route('/:activity_id')
    .all(requireAuth, jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const activity_id = req.params.activity_id;

        ActivitiesService.getById(db, activity_id)
            .then(activity => {
                if (!activity) {
                    return res.status(404).json({
                        error: { message: 'Activity does not exist' },
                    });
                }
                res.activity = activity;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(sanitizeActivities(res.activity));
    })
    .patch(jsonParser, (req, res, next) => {
        const db = req.app.get('db');
        const id = req.params.activity_id;

        const { activity, meridiem, start_time, day_id } = req.body;
        const updatedActivity = { activity, meridiem, start_time, day_id };

        const numValues = Object.values(updatedActivity).filter(Boolean).length;
        if (numValues === 0) {
            return res.status(400).json({
                error: { message: 'Request body must contain value to update' },
            });
        }

        ActivitiesService.updateActivity(db, id, updatedActivity)
            .then(activity => {
                res.status(201).json(sanitizeActivities(activity));
            })
            .catch(next);
    })
    .delete((req, res, next) => {
        const db = req.app.get('db');
        const id = req.params.activity_id;

        ActivitiesService.deleteActivity(db, id)
            .then(activity => res.status(204).end())
            .catch(next);
    });

module.exports = activitiesRouter;
