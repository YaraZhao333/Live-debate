const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// 管理员API路由
router.get('/admin/debate', adminController.getDebateSettings);
router.put('/admin/debate', adminController.updateDebateSettings);
router.get('/admin/users', adminController.getUsers);
router.get('/admin/users/:id', adminController.getUserById);
router.get('/admin/dashboard', adminController.getDashboard);

// V1 API兼容路由
router.get('/v1/admin/debate', adminController.getDebateSettings);
router.put('/v1/admin/debate', adminController.updateDebateSettings);
router.get('/v1/admin/users', adminController.getUsers);
router.get('/v1/admin/users/:id', adminController.getUserById);
router.get('/v1/admin/dashboard', adminController.getDashboard);

module.exports = router;