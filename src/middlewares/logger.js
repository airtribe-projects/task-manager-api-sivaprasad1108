const loggerUtil = require('../utils/loggerUtil');


function requestLogger(req, res, next) {
// log incoming request
const start = Date.now();
res.on('finish', () => {
const duration = Date.now() - start
loggerUtil.info({
requestId: req.requestId,
method: req.method,
route: req.originalUrl,
message: `${res.statusCode} ${res.statusMessage || ''} - ${duration}ms`,
meta: { statusCode: res.statusCode, duration }
});
});
next();
}


module.exports = { requestLogger }