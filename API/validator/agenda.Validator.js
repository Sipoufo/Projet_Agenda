const Joi = require('joi')

const objectId = (value, helpers) => {
    if (!value.match(/^[0-9a-fA-F]{24}$/)) {
        return helpers.message('"{{#label}}" must be a valid mongo id');
    }
    return value;
};

const addActivity = {
    body: Joi.object().keys({
        Subject: Joi.string().required(),
        StartTime: Joi.date().required(),
        EndTime: Joi.date().required(),
        Priority: Joi.number(),
        Description: Joi.string(),
    })
};

const putActivity = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required()
    }),
    body: Joi.object().keys({
        Subject: Joi.string().required(),
        StartTime: Joi.date().required(),
        EndTime: Joi.date().required(),
        Priority: Joi.number(),
        Description: Joi.string(),
    })
};

const getOneActivity = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required()
    })
};

const deletedActivity = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required()
    })
};

module.exports = {
    addActivity,
    putActivity,
    getOneActivity,
    deletedActivity
}