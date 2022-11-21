"use strict"
// const env = process.env.NODE_ENV || 'development';
const path = require("path");

const config = require('./config/config');
const app = require('express')();

require('./config/db')(app);
require('./config/express')(app);
require('./config/routes')(app);

// console.log(process.env);

app.listen(config.development.port, console.log(`Listening on port ${config.development.port}! Now its up to you...`));