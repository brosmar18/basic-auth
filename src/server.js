'use strict';

const express = require('express');
const notFound = require('./handlers/404');
const authRouter = require('./routes/auth');

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRouter);

app.get('/', (req, res, next) => {
    res.status(200).send("Hello World!");
});

app.use('*', notFound);

const start = () => {
    app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
};

module.exports = {start, app};
