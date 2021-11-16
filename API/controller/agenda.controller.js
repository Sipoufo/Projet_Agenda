const {Activity} = require('../model/index')

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

const addAgenda = catchAsync((req, res) => {
    const Subject = req.body.Subject
    const StartTime = new Date(req.body.StartTime)
    const EndTime = new Date(req.body.EndTime)
    const Priority = (req.body.Priority) ? req.body.Priority : null
    const Description = (req.body.Description) ? req.body.Description : null
    console.log(StartTime)
    console.log(EndTime)
    if (StartTime.getTime() < EndTime.getTime()) {
        Activity.findOne({Subject, StartTime, EndTime})
            .then((exist) => {
                if(!exist){
                    Activity.create({Subject, StartTime, EndTime, Priority, Description})
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
    const id = req.params.id
    const Subject = req.body.Subject
    const StartTime = new Date(req.body.StartTime)
    const EndTime = new Date(req.body.EndTime)
    const Priority = (req.body.Priority) ? req.body.Priority : null
    const Description = (req.body.Description) ? req.body.Description : null

    Activity.findById(id)
        .then( result => {
            if (result) {
                if (StartTime.getTime < EndTime.getTime) {
                    Activity.findOne({Subject, StartTime, EndTime})
                        .then((exist) => {
                            if(exist){
                                Activity.findByIdAndUpdate(id, {Subject, StartTime, EndTime, Priority, Description})
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
    const id = req.params.id
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