const wechatService = require('../services/wechatService');

// 认证相关控制器
module.exports = {
    // 微信登录
    wechatLogin: (req, res) => {
        try {
            const { code } = req.body;

            if (!code) {
                return res.status(400).json({
                    success: false,
                    message: '缺少code参数'
                });
            }

            const result = wechatService.verifyWechatLogin(code);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            console.error('微信登录失败:', error);
            res.status(500).json({
                success: false,
                message: '登录失败: ' + error.message
            });
        }
    },

    // 获取用户信息
    getUserInfo: (req, res) => {
        try {
            const { accessToken, openId } = req.query;

            if (!accessToken || !openId) {
                return res.status(400).json({
                    success: false,
                    message: '缺少accessToken或openId参数'
                });
            }

            const userInfo = wechatService.getWechatUserInfo(accessToken, openId);

            res.json({
                success: true,
                data: userInfo
            });
        } catch (error) {
            console.error('获取用户信息失败:', error);
            res.status(500).json({
                success: false,
                message: '获取用户信息失败: ' + error.message
            });
        }
    }
};