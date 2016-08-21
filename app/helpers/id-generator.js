'use strict'

var shortId = require('shortid');


shortId.worker(process.env.SHORTID_WORKER_ID || 1);

module.exports.getUserId = function (prefix) {
    return 't' + shortId.generate();
}

module.exports.getNextId = function (prefix) {
    return 'r' + shortId.generate();
}



