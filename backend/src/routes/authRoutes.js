const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 认证相关路由
router.post('/auth/wechat/login', authController.wechatLogin);
router.get('/auth/wechat/userinfo', authController.getUserInfo);

// V1 API兼容路由
router.post('/v1/auth/wechat/login', authController.wechatLogin);
router.get('/v1/auth/wechat/userinfo', authController.getUserInfo);

module.exports = router;