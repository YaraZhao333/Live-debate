const express = require('express');
const router = express.Router();
const wechatLoginController = require('../controllers/wechatLoginController');

// 微信登录路由
router.post('/wechat-login', wechatLoginController.wechatLogin);

module.exports = router;
