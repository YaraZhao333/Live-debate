// 票数状态管理
let currentVotes = {
    leftVotes: 0,
    rightVotes: 0
};

// 导出状态操作方法
module.exports = {
    getCurrentVotes: () => ({ ...currentVotes }),
    updateVotes: (leftVotes, rightVotes) => {
        if (typeof leftVotes !== 'undefined') {
            currentVotes.leftVotes = Math.max(0, leftVotes);
        }
        if (typeof rightVotes !== 'undefined') {
            currentVotes.rightVotes = Math.max(0, rightVotes);
        }
        return { ...currentVotes };
    },
    addVotes: (leftVotes, rightVotes) => {
        currentVotes.leftVotes = Math.max(0, currentVotes.leftVotes + leftVotes);
        currentVotes.rightVotes = Math.max(0, currentVotes.rightVotes + rightVotes);
        return { ...currentVotes };
    },
    resetVotes: (leftVotes = 0, rightVotes = 0) => {
        currentVotes = { 
            leftVotes: Math.max(0, leftVotes), 
            rightVotes: Math.max(0, rightVotes) 
        };
        return { ...currentVotes };
    },
    calculateVotePercentages: () => {
        const total = currentVotes.leftVotes + currentVotes.rightVotes;
        return {
            leftPercentage: total > 0 ? Math.round((currentVotes.leftVotes / total) * 100) : 50,
            rightPercentage: total > 0 ? Math.round((currentVotes.rightVotes / total) * 100) : 50,
            totalVotes: total
        };
    }
};