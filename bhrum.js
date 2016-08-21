'use strict'; // Always keep it strict!


//To refer different modules irrespective of where we are.
require('rootpath')();
// Banner
require('banner').print('config/banner.txt');

//Setting max listeners to infinite.
process.setMaxListeners(0);

var app = require('app'),
    config = require('config'),
    argh = require('argh').argv,
    colors = require('colors'),
    log = require('app/utils/logger')(module);

// DEBUG for stacktrace
if (process.env.NODE_ENV !== 'production') {
    require('longjohn');
}
// uncaught exception
process.on('uncaughtException', function (err) {
    log.error('uncaughtException:', err.message);
    log.error(err.stack);
});

var port = +argh.port || config.app.port, //PORT
    host = +argh.host || config.app.host; //HOST

if (process.env.NODE_ENV === 'production') {
    log.info(colors.green('         **** PRODUCTION MODE ****       '));
} else {
    log.info(colors.green('         **** DEVELOPMENT MODE ****       '));
}

app.start(host, port);
