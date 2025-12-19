const loggerUtil = require('../utils/loggerUtil');


function errorHandler(err, req, res, next) {
    // Log the error in structured format
    loggerUtil.error({
        requestId: req.requestId,
        method: req.method,
        route: req.originalUrl,
        message: err.message || 'Internal server error',
        meta: { stack: err.stack }
    });


    // Do not expose stack trace in production
    const isProd = process.env.NODE_ENV === 'production';
    const body = {
        error: 'Internal Server Error'
    };
    if (!isProd) {
        body.message = err.message;
        body.stack = err.stack;
    }


    res.status(500).json(body);
}


module.exports = errorHandler;