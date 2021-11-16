const express = require('express');
const mongoose = require('mongoose');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const agenda = require('./router/agenda.router');
const httpStatus = require('http-status');

dotenv.config({ path: './.env' })
const PORT = process.env.PORT

class ApiError extends Error {
    constructor(statusCode, message, isOperational = true, stack = '') {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        if (stack) {
        this.stack = stack;
        } else {
        Error.captureStackTrace(this, this.constructor);
        }
    }
}

mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('MongoDB connection established.'))
.catch((error) => console.error("MongoDB connection failed:", error.message))

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// For cors
app.use(cors())
app.options('*', cors())

// agenda routes
app.use('/agenda', agenda)

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(res.status(404).json({ status: 404, result: "Not found" }));
});

// convert error
app.use((err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
});

app.listen(PORT, () => {
    console.log(`We listening with the port ${PORT}`)
})