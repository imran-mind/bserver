
'use strict';

var config = require('config'),
    winston = require('winston'),
    moment = require('moment'),
    os = require("os");

winston.emitErrs = true;

module.exports = function (_module) {
    var node = os.hostname() + '-' + process.pid + ' ';
    // Return the last folder name in the path and the calling module's filename.
    var getLabel = function (_module) {
        var parts = _module.filename.split('/');
        return parts[parts.length - 2] + '/' + parts.pop();
    };

    var transports = [];
    if (process.env.NODE_ENV !== 'production') {
        transports.push(new winston.transports.Console({
            label: getLabel(_module),
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: function () {
                return node + moment().format();
            }
        }));
    } else {
        transports.push(new winston.transports.File({
            label: getLabel(_module),
            level: config.logger.level,
            filename: config.logger.filename,
            handleExceptions: true,
            json: false,
            maxsize: 5000000, // 5MB
            maxFiles: 2,
            colorize: false,
            timestamp: function () {
                return node + moment().format();
            }
        }));
    }


    return new winston.Logger({
        transports: transports, exitOnError: false
    });
}
