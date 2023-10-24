'use strict';

const express = require('express');
const notFound = require('./handlers/404');
const errorHandler = require('./handlers/500');
const authRouter = require('./routes/auth');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

app.get('/', (req, res, next) => {
    res.status(200).send("Hello World!");
});

app.get('/error', (req, res, next) => {
    // Trigger the 500 error handler for testing.
    throw new Error('Forced Error for Testing');
});

app.use('*', notFound);
app.use(errorHandler);

const start = () => {
    app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
};

module.exports = {start, app};
