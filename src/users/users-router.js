const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service')
const { requireAuth } = require('../middleware/basic-auth')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    first_name: xss(user.first_name),
    last_name: xss(user.last_name),
    email: xss(user.email),
    password: user.password
})



usersRouter
    .route('/')
    .post(jsonParser, (req, res, next) => {
        const { first_name, last_name, email, password } = req.body

        for (const field of ['first_name', 'last_name', 'email', 'password'])
            if (!req.body[field])
                return res.status(200).json({
                    error: { message: `Missing '${field}' in body request` }
                });

        const passwordError = UsersService.validatePassword(password)

        if (passwordError)
            return res.status(400).json({ error: passwordError })

        UsersService.hasUserWithEmail(
            req.app.get('db'),
            email
        )
            .then(hasUserWithEmail => {
                if (hasUserWithEmail)
                    return res.status(400).json({ error: `Email already taken` })

                return UsersService.hashPassword(password)
                    .then(hashedPassword => {
                        const newUser = {
                            email,
                            password: hashedPassword,
                            first_name,
                            last_name,
                        }
                        return UsersService.insertUser(req.app.get('db'), newUser)
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(serializeUser(user))
                            })
                    })
            })
            .catch(err => {
                console.log('error has user id route / : ' + err);
                next;
            })
    })
    .get(requireAuth, (req, res, next) => {
        UsersService.getAllUsers(
            req.app.get('db')
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User does not exist` }
                    })
                }
                res.json(user)
                next()
            })
            .catch(err => {
                console.log('error getAllUsers: ' + err);
                next;
            })
    })

usersRouter
    .route('/user')
    .all(requireAuth, (req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.user.id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User does not exist` }
                    })
                }
                res.user = user
                next()
            })
            .catch(err => {
                console.log('error getById route user: ' + err);
                next;
            })
    })
    .get(requireAuth, (req, res, next) => {
        UsersService.getById(
            req.app.get('db'),
            req.user.id
        )
            .then(user => {
                if (!user) {
                    return res.status(404).json({
                        error: { message: `User does not exist` }
                    })
                }
                res.json(user)
                next()
            })
            .catch(err => {
                console.log('error getById: ' + err);
                next;
            })
    })
    .delete(requireAuth, (req, res, next) => {
        UsersService.deleteUser(
            req.app.get('db'),
            req.user.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(err => {
                console.log('error deleteUser: ' + err);
                next;
            })
    })
    .patch(requireAuth, jsonParser, (req, res, next) => {
        const { first_name, last_name, email } = req.body
        const userToUpdate = { first_name, last_name, email }

        const numberOfValues = Object.values(userToUpdate).filter(Boolean).length
        if (numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'firstname', 'lastname', 'email', 'password'`
                }
            })

        UsersService.updateUser(
            req.app.get('db'),
            req.user.id,
            userToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(err => {
                console.log('error updateUser: ' + err);
                next;
            })
    })
module.exports = usersRouter
