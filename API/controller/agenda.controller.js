const {Activity} = require('../model/index')

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const addAgenda = catchAsync((req, res) => {
    const activity = req.body.activity
    const startTime = new Date(req.body.startTime)
    const endTime = new Date(req.body.endTime)

    if (startTime.getTime < endTime.getTime) {
        Activity.findOne({activity, startTime, endTime})
            .then((exist) => {
                if(!exist){
                    Activity.create({activity, startTime, endTime})
                        .then( (activityHading) => {
                            res.status(200).json({ status: 200, result: activityHading })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }else {
                    res.status(500).json({ status: 500, error: "This activity exist" })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        res.status(500).json({ status: 500, error: "The start date must be less than the end date" })
    }
});

const putInformation = catchAsync((req, res) => {
    const id = req.param.id
    const activity = req.body.activity
    const startTime = new Date(req.body.startTime)
    const endTime = new Date(req.body.endTime)

    Activity.findById(id)
        .then( result => {
            if (result) {
                if (startTime.getTime < endTime.getTime) {
                    Activity.findOne({activity, startTime, endTime})
                        .then((exist) => {
                            if(exist){
                                Activity.findByIdAndUpdate(id, {activity, startTime, endTime})
                                    .then( (activityHading) => {
                                        res.status(200).json({ status: 200, result: activityHading })
                                    })
                                    .catch((err) => {
                                        console.log(err)
                                    })
                            }else {
                                res.status(500).json({ status: 500, error: "This activity don't exist" })
                            }
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                } else {
                    res.status(500).json({ status: 500, error: "The start date must be less than the end date" })
                }
            } else {
                res.status(500).json({ status: 500, error: "This activity don't exist" })
            }
        })
        .catch((err) => {
            console.log(err)
        })
});

const getOneActivity = catchAsync((req, res) => {
    const id = req.param.id
    Activity.findById(id)
        .then((activity) => {
            res.status(200).json({ status: 200, result: activity })
        })
        .catch((err) => {
            console.log(err)
        })
});

const deletedActivity = catchAsync((req, res) => {
    const id = req.param.id
    Activity.findById(id)
        .then((activity) => {
            if(activity){
                Activity.findByIdAndRemove(id)
                    .then( (activityDeleting) => {
                        res.status(200).json({ status: 200, result: activityDeleting })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }else {
                res.status(500).json({ status: 500, error: "This activity don't exist" })
            }
        })
        .catch((err) => {
            console.log(err)
        })
});

const getAllActivity = catchAsync((req, res) => {
    Activity.find()
        .then((activity) => {
            res.status(200).json({ status: 200, result: activity })
        })
        .catch((err) => {
            console.log(err)
        })
});



module.exports = {
    addAgenda,
    putInformation,
    getOneActivity,
    getAllActivity,
    deletedActivity
}