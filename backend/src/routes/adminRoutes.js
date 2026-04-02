const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 管理员API路由
router.get('/debbate', adminController.getDebateSettings);
router.put('/debbate', adminController.updateDebateSettings);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.get('/dashboard', adminController.getDashboard);

// 辩题管理路由
router.post('/debates', adminController.createDebate);
router.get('/debates/:id', adminController.getDebateById);
router.put('/streams/:streamId/debate', adminController.associateDebateToStream);
router.delete('/streams/:streamId/debate', adminController.deleteStreamDebateTopic);

module.exports = router;
