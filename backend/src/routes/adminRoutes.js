const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 管理员API路由
router.get('/admin/debate', adminController.getDebateSettings);
router.put('/admin/debate', adminController.updateDebateSettings);
router.get('/admin/users', adminController.getUsers);
router.get('/admin/users/:id', adminController.getUserById);
router.get('/admin/dashboard', adminController.getDashboard);

module.exports = router;
