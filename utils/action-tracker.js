const ActionTracker = require('../models/ActionTracker');

module.exports = {

    
    saveAction: async function(action){
        if(!action) return
        await new ActionTracker({action, time: Math.floor(Date.now() / 1000)}).save();
    },

    getLastAction: async function(action){
        const data = await ActionTracker.find({action}).sort({time: 1}).limit(1);
        if(!data || data.length === 0) return 0
        return data[0].time
    },

    getTimeSinceLastAction: async function(action){
        const lastAction = await this.getLastAction(action);
        const currentTime = Math.floor(Date.now() / 1000);
        return currentTime - lastAction;
    },

    isAllowedToRun: async function({action, cooldown}){
        const timeSinceLastAction = await this.getTimeSinceLastAction(action);
        if(cooldown > timeSinceLastAction) return false;
        return true
    }
}