const { number } = require('joi');
const mongoose = require('mongoose')
const model = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

const activitySchema = new model({
    Subject: {
        type: String,
        required: true
    },
    Location: {
        type: String,
        required: false
    },
    StartTime: {
        type: Date,
        required: true,
    },
    EndTime: {
        type: Date,
        required: true,
    },
    Priority: {
        type: Number,
        required: false,
        default: null
    },
    Description: {
        type: String,
        required: false,
        default: null
    },
    Participant: [{
        type: String,
        required: false,
    }],
    IsAllDay: {
        type: Boolean,
        required: true,
        default: false,
    },
    RecurrenceRule: {
        type: String,
        required: false,
        default: null
    },
}, {
    timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
})

activitySchema.plugin(mongoosePaginate);

const Activity = mongoose.model('activity', activitySchema)

module.exports = Activity