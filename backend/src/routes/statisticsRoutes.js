const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/votes/statistics', statisticsController.getVotesStatistics);
router.get('/statistics', statisticsController.getVotesStatistics);

module.exports = router;
