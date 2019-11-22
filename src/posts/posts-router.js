const path = require('path');
const express = require('express')
const xss = require('xss')
const PostsService = require('./posts-service')
const { requireAuth } = require('../middleware/basic-auth')

const postsRouter = express.Router()
const jsonParser = express.json()

const serializePost = post => ({
    id: post.id,
    pet_name: xss(post.pet_name),
    email: xss(post.email),
    type_of_pet: xss(post.type_of_pet),
    birthdate: post.birthdate,
    hobbies: xss(post.hobbies),
    owner: post.owner
})

postsRouter
    .route('/')
    .get((req, res, next) => {
        PostsService.getAllPosts(req.app.get('db'))
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(err => {
                console.log('error getting posts using getAllPosts: ' + err);
                next;
            });
    })
    .post(requireAuth, jsonParser, (req, res, next) => {
        const owner = req.user.id;
        const email = req.user.email;
        const { pet_name, type_of_pet, birthdate, hobbies } = req.body;
        const newPost = { pet_name, email, type_of_pet, birthdate, hobbies, owner }

        for (const [key, value] of Object.entries(newPost))
            if (value == null)
                return res.status(400).json({
                    error: { message: `Missing ${key} in body request` }
                });

        PostsService.insertPost(req.app.get('db'), newPost)
            .then(post => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${post.id}`))
                    .json(serializePost(post))
            })
            .catch(err => {
                console.log('error adding post: ' + err);
                next;
            });
    })
postsRouter
    .route('/myPosts')
    .get(requireAuth, jsonParser, (req, res, next) => {
        const owner = req.user.id;
        PostsService.getByOwnerId(req.app.get('db'), owner)
            .then(posts => {
                res.json(posts.map(serializePost))
            })
            .catch(err => {
                console.log('error getting posts: ' + err);
                next;
            })
    })

postsRouter
    .route('/:post_id')
    .all((req, res, next) => {
        console.log('db: ', req.app.get('db'));
        PostsService.getById(req.app.get('db'), req.params.post_id)
            .then(post => {
                if (!post) {
                    return res.status(404).json({
                        error: { message: 'Post not found' }
                    })
                }
                res.post = post
                next()
            })
            .catch(err => {
                console.log('error getById: ' + err);
                next;
            })
    })
    .get((req, res, next) => {
        res.json(serializePost(res.post))
    })
    .delete(requireAuth, (req, res, next) => {
        PostsService.deletePost(
            req.app.get('db'),
            req.params.post_id
        )
            .then(() => {
                res.status(204).end()
            })
            .catch(err => {
                console.log('error deleting post DeletePost: ' + err);
                next;
            })
            .patch(requireAuth, jsonParser, (req, res, next) => {
                const { pet_name, email, type_of_pet, hobbies } = req.body
                const postToUpdate = { pet_name, email, type_of_pet, hobbies }

                const numberOfValues = Object.values(postToUpdate).filter(Boolean).length
                if (numberOfValues === 0) {
                    return res.status(400).json({ error: { message: `Request must contain at least one value` } })
                }

                PostsService.updatePost(
                    req.app.get('db'),
                    req.params.post_id,
                    postToUpdate
                )
                    .then(numRowsAffected => {
                        res.status(204).end()
                    })
                    .catch(err => {
                        console.log('error updatePost: ' + err);
                        next;
                    })
            })
    })

module.exports = postsRouter



