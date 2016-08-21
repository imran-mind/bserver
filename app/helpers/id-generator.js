'use strict'
/** A unique id generator, Writing this module separately so as to
 * change the unique id generation logic at any time.
 */

var shortId = require('shortid');

//Requires worker id in case running multiple instances on same machine
//an integer between 0 and 16
shortId.worker(process.env.SHORTID_WORKER_ID || 1);

module.exports.getUserId = function (prefix) {
    return 't' + shortId.generate();
}

module.exports.getNextDriverId = function (prefix) {
    return 'd' + shortId.generate();
}

module.exports.getNextRiderId = function (prefix) {
    return 'r' + shortId.generate();
}

module.exports.getNextVehicleId = function (prefix) {
    return 'r' + shortId.generate();
}

