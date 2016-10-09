/**
 * Created by imran on 6/10/16.
 */



var debug = require('debug')('app.dao.alarm');

var log = require('app/utils/logger')(module),
    MPickdrop = require('app/models').Pickdrop;

var pickdrop = {
    getPickDrops: getPickDrops,
    addPickDrop: addPickDrop,
    getPickDropById: getPickDropById
}

function getPickDropById(condition, cb) {
    MPickdrop
        .find(condition)
        .then(function (data) {
            return cb(null, data);
        }, function (error) {
            log.error("==>error in getting getPickDropById  ", error.message);
            return cb(error);
        });
}

function addPickDrop(payload, condition, cb) {
    MPickdrop.update(payload, condition)
        .then(function (result) {
            log.info("==>address added successfully!!");
            cb(null, result);
        }, function (err) {
            log.error('error in dao addPickDrop', err);
            cb(err.message);
        });
}

function getPickDrops(condition, cb) {
    MPickdrop
        .findAll(condition)
        .then(function (data) {
            if (data) {
                return cb(null, data);
            }
        }, function (error) {
            log.error("error in getting pickdrop data ", error.message);
            return cb(error);
        });
}

module.exports = pickdrop;
