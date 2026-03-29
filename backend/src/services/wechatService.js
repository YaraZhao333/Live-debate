// 微信相关服务（预留接口）
module.exports = {
    // 微信登录验证
    verifyWechatLogin: (code) => {
        // 实现微信登录验证逻辑
        return {
            success: true,
            userId: 'mock-user-id',
            nickname: '微信用户',
            avatar: 'https://example.com/avatar.jpg'
        };
    },

    // 获取微信用户信息
    getWechatUserInfo: (accessToken, openId) => {
        // 实现获取微信用户信息逻辑
        return {
            openId: openId,
            nickname: '微信用户',
            avatar: 'https://example.com/avatar.jpg',
            city: '北京'
        };
    },

    // 发送微信模板消息
    sendWechatTemplateMessage: (openId, templateId, data) => {
        // 实现发送微信模板消息逻辑
        return {
            success: true,
            messageId: 'mock-message-id'
        };
    }
};