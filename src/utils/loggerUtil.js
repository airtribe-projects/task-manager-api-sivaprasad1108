// logger util: produces both structured JSON for CloudWatch and a readable string


function formatLog({ timestamp = new Date().toISOString(), type = 'log', requestId = '-', method = '-', route = '-', message = '', meta = {} }) {
    // CloudWatch-friendly JSON
    const json = {
        timestamp,
        type,
        requestId,
        method,
        route,
        message,
        meta,
    };
    // readable string
    const str = `[${timestamp}] [${type}] [${requestId}] [${method}] [${route}] ${message}`;
    return { json, str };
}


function info(ctx) {
    const out = formatLog({ ...ctx, type: 'info' });
    console.log(JSON.stringify(out.json));
}


function warn(ctx) {
    const out = formatLog({ ...ctx, type: 'warn' });
    console.warn(JSON.stringify(out.json));
}


function error(ctx) {
    const out = formatLog({ ...ctx, type: 'error' });
    console.error(JSON.stringify(out.json));
}


module.exports = { info, warn, error, formatLog };