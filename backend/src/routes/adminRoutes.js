const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 管理员API路由
router.get('/debbate', adminController.getDebateSettings);
router.put('/debbate', adminController.updateDebateSettings);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.get('/dashboard', adminController.getDashboard);

module.exports = router;
