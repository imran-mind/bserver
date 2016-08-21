'use strict';


var express = require('express'),
    log = require('app/utils/logger')(module),
    app = express();

/*var models = require('app/models');*/

var http = require('http').Server(app);

http.on('error', function (err) {
    log.error('HTTP Error', err.message);
    log.error(err.stack);
});

app
    .set('models', "")
    .use('/', require('app/routes')(app));

module.exports.start = function (host, port) {
    http.listen(port, host, function () {
        log.info('HTTP Server is ready now @ ', host, ':', port);
    });
};
