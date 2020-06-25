require('dotenv').config();
const express = require('express');
const usersRouter = express.Router();
const xss = require('xss');
const path = require('path');
const jsonParser = express.json();
const UsersService = require('./users-service');

const sanitizeUsers = user => ({
    id: user.id,
    username: xss(user.username),
    email: xss(user.email),
    fullname: xss(user.fullname),
    date_created: user.date_created,
});

usersRouter.route('/').post(jsonParser, (req, res, next) => {
    const db = req.app.get('db');
    const { fullname, username, email, password } = req.body;

    const requiredUser = { fullname, password, username, email };

    for (const [key, value] of Object.entries(requiredUser)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing ${key} in request body` },
            });
        }
    }

    const passwordError = UsersService.validatePassword(password);
    if (passwordError) return res.status(400).json({ error: passwordError });

    const emailError = UsersService.validateEmail(email);
    if (emailError) return res.status(400).json({ error: emailError });

    UsersService.hasUserWithUsername(req.app.get('db'), username)
        .then(hasUserWithUsername => {
            if (hasUserWithUsername)
                return res
                    .status(400)
                    .json({ error: 'Username already taken' });

            return UsersService.hashPassword(password).then(hashedPassword => {
                const newUser = {
                    fullname,
                    password: hashedPassword,
                    username,
                    email,
                };

                return UsersService.insertUser(db, newUser).then(user => {
                    res.status(201)
                        .location(
                            path.posix.join(req.originalUrl, `/${user.id}`)
                        )
                        .json(sanitizeUsers(user));
                });
            });
        })
        .catch(next);
});

module.exports = usersRouter;
