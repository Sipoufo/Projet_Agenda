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
        Location: Joi.string(),
    })
};

const putActivity = {
    body: Joi.object().keys({
        ident: Joi.custom(objectId).required(),
        Subject: Joi.string().required(),
        StartTime: Joi.date().required(),
        EndTime: Joi.date().required(),
        Priority: Joi.number(),
        Description: Joi.string(),
        Location: Joi.string(),
    })
};

const getOneActivity = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    })
};

const deletedActivity = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    })
};

module.exports = {
    addActivity,
    putActivity,
    getOneActivity,
    deletedActivity
}