const express = require('express');
const requestId = require('./src/middlewares/requestId');
const logger = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/errorHandler');
const tasksRouter = require('./src/routes/tasks');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestId);
app.use(logger.requestLogger);

// API routes
app.use('/tasks', tasksRouter);

// 404 for unknown routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

// Central error handler
app.use(errorHandler);

module.exports = app;