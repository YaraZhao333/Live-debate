const { getCurrentVotes, updateVotes: updateVotesState, resetVotes: resetVotesState, calculateVotePercentages, addVotes: addVotesState } = require('../state/voteState');
const { broadcast } = require('../websocket/wsServer');

// 票数相关服务
module.exports = {
    // 获取当前票数
    getVotes: () => {
        const votes = getCurrentVotes();
        const percentages = calculateVotePercentages();
        return {
            ...votes,
            ...percentages
        };
    },

    // 设置票数（直接设置为指定值）
    setVotes: (leftVotes, rightVotes) => {
        // 验证参数
        if (typeof leftVotes !== 'number' || leftVotes < 0) {
            throw new Error('leftVotes必须是非负数字');
        }
        if (typeof rightVotes !== 'number' || rightVotes < 0) {
            throw new Error('rightVotes必须是非负数字');
        }

        // 直接设置票数
        const updatedVotes = updateVotesState(leftVotes, rightVotes);
        const percentages = calculateVotePercentages();

        // 广播票数更新
        broadcast('vote-updated', {
            votes: { ...updatedVotes, ...percentages },
            updatedBy: 'admin',
            action: 'set'
        });

        return { ...updatedVotes, ...percentages };
    },

    // 增加票数
    addVotes: (leftVotes, rightVotes) => {
        // 验证参数
        if (typeof leftVotes !== 'number' || leftVotes < 0) {
            throw new Error('leftVotes必须是非负数字');
        }
        if (typeof rightVotes !== 'number' || rightVotes < 0) {
            throw new Error('rightVotes必须是非负数字');
        }

        // 增加票数
        const updatedVotes = addVotesState(leftVotes, rightVotes);
        const percentages = calculateVotePercentages();

        // 广播票数更新
        broadcast('vote-updated', {
            votes: { ...updatedVotes, ...percentages },
            updatedBy: 'admin',
            action: 'add'
        });

        return { ...updatedVotes, ...percentages };
    },

    // 更新票数
    updateVotes: (leftVotes, rightVotes) => {
        // 验证参数
        if (typeof leftVotes !== 'undefined' && (typeof leftVotes !== 'number' || leftVotes < 0)) {
            throw new Error('leftVotes必须是非负数字');
        }
        if (typeof rightVotes !== 'undefined' && (typeof rightVotes !== 'number' || rightVotes < 0)) {
            throw new Error('rightVotes必须是非负数字');
        }

        // 更新票数
        const updatedVotes = updateVotesState(leftVotes, rightVotes);
        const percentages = calculateVotePercentages();

        // 广播票数更新
        broadcast('vote-updated', {
            votes: { ...updatedVotes, ...percentages },
            updatedBy: 'admin'
        });

        return { ...updatedVotes, ...percentages };
    },

    // 重置票数
    resetVotes: (leftVotes = 0, rightVotes = 0) => {
        // 验证参数
        if (typeof leftVotes !== 'number' || leftVotes < 0) {
            throw new Error('leftVotes必须是非负数字');
        }
        if (typeof rightVotes !== 'number' || rightVotes < 0) {
            throw new Error('rightVotes必须是非负数字');
        }

        const resetVotesData = resetVotesState(leftVotes, rightVotes);
        const percentages = calculateVotePercentages();

        // 广播票数重置
        broadcast('vote-updated', {
            votes: {
                ...resetVotesData,
                ...percentages
            },
            updatedBy: 'admin',
            action: 'reset'
        });

        return { ...resetVotesData, ...percentages };
    }
};