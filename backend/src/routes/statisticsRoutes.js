const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

router.get('/admin/votes/statistics', statisticsController.getVotesStatistics);
router.get('/admin/statistics', statisticsController.getVotesStatistics);

module.exports = router;
