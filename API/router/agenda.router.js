const express = require('express');
const Joi = require('joi');
const router = express.Router();
const {AgendaController} = require("../controller/index")
const {AgendaValidator} = require("../validator/index")


const pick = (object, keys) => {
    return keys.reduce((obj, key) => {
        if (object && Object.prototype.hasOwnProperty.call(object, key)) {
        obj[key] = object[key];
        }
        return obj;
    }, {});
};
const validate = (schema) => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = Joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return res.status(500).json({ status: 500, error: errorMessage })
    }
    Object.assign(req, value);
    return next();
};

router
    .route('/addActivity')
    .post(AgendaController.addAgenda);

router
    .route('/putActivity/:id')
    .put(validate(AgendaValidator.putActivity), AgendaController.putInformation);
    
router
    .route('/getOneActivity/:id')
    .get(validate(AgendaValidator.getOneActivity), AgendaController.getOneActivity);

router
    .route('/getAllActivity')
    .get(AgendaController.getAllActivity);

router
    .route('/deleteOneActivity/:id')
    .delete(AgendaController.deletedActivity);

module.exports = router