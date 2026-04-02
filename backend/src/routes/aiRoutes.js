const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// AI控制API路由
router.post('/ai/start', aiController.startAI);
router.post('/ai/stop', aiController.stopAI);
router.post('/ai/toggle', aiController.toggleAI);

// AI内容管理API路由
const aiContentController = require('../controllers/aiContentController');
router.get('/ai-content', aiContentController.getAiContent);
router.get('/ai-content/list', aiController.getAIContentList);
router.get('/ai-content/:id', aiController.getAIContentById);
router.post('/ai-content', aiController.addAIContent);
router.put('/ai-content/:id', aiController.updateAIContent);
router.get('/ai-content/:id/comments', aiController.getAIContentComments);
router.delete('/ai-content/:id/comments/:commentId', aiController.deleteAIContentComment);  

module.exports = router;
