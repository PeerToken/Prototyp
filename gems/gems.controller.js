const express = require('express');
const router = express.Router();
const gemsService = require('./gems.service');

router.get('/:id', getGems)

module.exports = router;

function getGems(req, res, next) {
    gemsService.getAllGemsForUserId(req.params.id)
        .then(gems => res.json(gems))
        .catch(err => next(err));
}