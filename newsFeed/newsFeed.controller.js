const express = require('express');
const { get } = require('mongoose');
const userModel = require('../users/user.model');
const router = express.Router();
const newsFeedService = require('./newsFeed.service');

router.post('/post', post);
router.get('/', getSpecificLimit);
router.put('/like', likeAPost);
router.delete('/like', dislikeAPost);
router.delete('/', deletePost);

module.exports = router;

function post(req, res, next) {
    newsFeedService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getSpecificLimit(req, res, next) {
    newsFeedService.getSpecificLimit(req.query.skipAmount, req.query.amount)
        .then(newsFeeds => res.json(newsFeeds))
        .catch(err => next(err));
}

function likeAPost(req, res, next) {
    newsFeedService.like(req.query.userId, req.query.postId, req.query.creatorId)
        .then(id => res.json({id: id}))
        .catch(err => next(err));
}

function dislikeAPost(req, res, next) {
    newsFeedService.dislike(req.query.userId, req.query.postId)
        .then(id => res.json({id: id}))
        .catch(err => next(err));
}

function deletePost(req, res, next) {
    newsFeedService.deletePost(req.query.postId)
        .then(id => res.json({id: id}))
        .catch(err => next(err));
}