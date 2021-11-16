const mongoose = require('mongoose')
const model = mongoose.Schema
var mongoosePaginate = require('mongoose-paginate-v2');

const activitySchema = new model({
        activity: {
            type: String,
            required: true
        },
        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },
    }, {
        timestamps: { currentTime: () => new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), new Date().getHours() + 1, new Date().getMinutes(), new Date().getMilliseconds()) },
    }

)

activitySchema.plugin(mongoosePaginate);

const Activity = mongoose.model('activity', activitySchema)

module.exports = Activity