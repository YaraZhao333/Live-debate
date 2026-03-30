const express = require('express');
const router = express.Router();
const debateTopicController = require('../controllers/debateTopicController');

// 辩题路由
router.get('/debate-topic', debateTopicController.getDebateTopic);
router.get('/v1/debate-topic', debateTopicController.getDebateTopic);

module.exports = router;
