const express = require('express');
const router = express.Router();
const aiContentController = require('../controllers/aiContentController');

// AI内容路由
router.get('/ai-content', aiContentController.getAiContent);
router.get('/v1/ai-content', aiContentController.getAiContent);

module.exports = router;
