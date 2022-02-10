const mongoose = require('mongoose');
const ActionTrackerSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    time: {
        type: Number,
        required: true,
        
    }
});


const ActionTracker = mongoose.model('ActionTracker', ActionTrackerSchema);

module.exports = ActionTracker;