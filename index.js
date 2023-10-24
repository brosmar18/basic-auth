'use strict';

const { start } = require('./src/server');
const { sequelizeDatabase } = require('./src/models');

sequelizeDatabase.sync()
    .then(() => {
        console.log('Successful Connection!');
        start();
    })
    .catch(e => console.error(e));
