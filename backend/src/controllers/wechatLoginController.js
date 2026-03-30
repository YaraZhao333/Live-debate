const mockService = require('../services/mockService');
const { v4: uuidv4 } = require('uuid');

// 微信登录控制器
module.exports = {
    wechatLogin: (req, res) => {
        try {
            const { code, userInfo } = req.body;

            if (!code) {
                return res.status(400).json({
                    success: false,
                    message: '缺少code参数'
                });
            }

            const userId = uuidv4();
            const token = `mock-token-${userId}-${Date.now()}`;

            const newUser = mockService.users.createOrUpdate({
                id: userId,
                nickname: userInfo?.nickName || '微信用户',
                avatar: userInfo?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
            });

            res.json({
                success: true,
                data: {
                    userId,
                    token,
                    userInfo: {
                        id: newUser.id,
                        nickname: newUser.nickname,
                        avatar: newUser.avatar
                    }
                }
            });
        } catch (error) {
            console.error('微信登录失败:', error);
            res.status(500).json({
                success: false,
                message: '登录失败: ' + error.message
            });
        }
    }
};
