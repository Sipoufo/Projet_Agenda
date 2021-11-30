const {Activity} = require('../model/index');
var mongoose = require('mongoose');

const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};

// Function for add the event agenda to the BDD
const addAgenda = catchAsync((req, res) => {
    console.log(req.body);
    const Subject = req.body.Subject
    const StartTime = new Date(req.body.StartTime)
    const EndTime = new Date(req.body.EndTime)
    const Priority = (req.body.Priority) ? req.body.Priority : null
    const Participant = req.body.Participant
    const Description = (req.body.Description) ? req.body.Description : null
    const Location = (req.body.Location) ? req.body.Location : null
    console.log(StartTime)
    console.log(EndTime)
    if (StartTime.getTime() < EndTime.getTime()) {
        Activity.findOne({Subject, StartTime, EndTime})
            .then((exist) => {
                if(!exist){
                    Activity.create({Subject, StartTime, EndTime, Priority, Description, Location})
                        .then(async (activityHading) => {
                            if(Participant.length > 0) {
                                for (let i = 0; i < Participant.length; i++) {
                                    console.log(Participant[i])
                                    await Activity.findByIdAndUpdate(activityHading._id, { $push: {Participant: Participant[i]} })
                                }
                            }
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

// Function for put the event agenda to the BDD
const putInformation = catchAsync((req, res) => {
    const id = req.body.ident;
    const Subject = req.body.Subject
    const StartTime = new Date(req.body.StartTime)
    const EndTime = new Date(req.body.EndTime)
    const Priority = (req.body.Priority) ? req.body.Priority : null
    const Description = (req.body.Description) ? req.body.Description : null

    Activity.findById(id)
        .then( result => {
            if (result) {
                if (StartTime.getTime() < EndTime.getTime()) {
                    Activity.findOne({Subject, StartTime, EndTime})
                    .then((exist) => {
                            console.log(exist)
                            if(!exist){
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
                    console.log("The start date must be less than the end date");
                }
            } else {
                res.status(500).json({ status: 500, error: "This activity don't exist" })
                console.log("This activity don't exist");
            }
        })
        .catch((err) => {
            console.log(err)
        })
});

// Function for get the event agenda to the BDD
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

// Function for delete the event agenda to the BDD
const deletedActivity = catchAsync((req, res) => {
    const id = req.params.id
    console.log(req.params)
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

// Function for all the events agenda to the BDD
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