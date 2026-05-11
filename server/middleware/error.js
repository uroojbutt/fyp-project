class ErrorHandler extends Error {

    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
        this.isOperational = true

        // Capture stack trace
        Error.captureStackTrace(this, this.constructor)
    }
}

const errorHandler = (err, req, res, next) => {
    console.error(err);
    let statusCode = err.statusCode || 500
    let message = err.message || 'Internal Server Error'

    //--------
    // MONGOOSE CAST ERROR
    // e.g. invalid ObjectId → /users/not-a-valid-id
    //--------
    if (err.name === 'CastError') {
        statusCode = 400
        message = `Invalid ${err.path}: ${err.value}`
    }

    //--------
    // MONGOOSE DUPLICATE KEY
    // e.g. unique field already exists in DB
    //--------
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        const value = err.keyValue[field]
        statusCode = 409
        message = `${field} '${value}' is already taken`
    }

    //--------
    // MONGOOSE VALIDATION ERROR
    // e.g. required field missing, enum mismatch
    //--------
    if (err.name === 'ValidationError') {
        statusCode = 400
        message = Object.values(err.errors)
            .map(e => e.message)
            .join(', ')
    }

    //--------
    // JWT EXPIRED
    // e.g. token was valid but has expired
    //--------
    if (err.name === 'TokenExpiredError') {
        statusCode = 401
        message = 'Your session has expired. Please log in again.'
    }

    //--------
    // JWT MALFORMED / INVALID SIGNATURE
    // e.g. tampered token or wrong secret
    //--------
    if (err.name === 'JsonWebTokenError') {
        statusCode = 401
        message = 'Invalid token. Please log in again.'
    }

    //--------
    // JWT NOT YET VALID
    // e.g. token used before its nbf (not-before) time
    //--------
    if (err.name === 'NotBeforeError') {
        statusCode = 401
        message = 'Token not yet active. Please try again shortly.'
    }

    //--------
    // RESPONSE
    //--------
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    })
    const errorMessage = err.message ? Object.values(err.errors).map(e => e.message).join(', ') : err.message;

}

export { ErrorHandler, errorHandler }