var debug = require('debug')('app.service.pickdrop'),
    log = require('app/utils/logger')(module),
    async = require('async');
var pickdropDao = require('app/dao/pickdrop');

var pickdrop = {
    getPickDrops: getPickDrops,
    addPickDrop: addPickDrop,
    getPickDropById: getPickDropById
}

function getPickDropById(condition, cb) {
    pickdropDao.getPickDropById(condition, function (err, result) {
        if (err) {
            log.error("==>Error service/pickdrop-getPickDropById function ", err);
            return cb(err);
        }
        cb(null, result);
    });
}


function addPickDrop(input, id, cb) {
    var condition = {
        where: {
            id: id
        }
    };
    var payload = {
        name: input.name,
        fromAdd: input.fromAdd,
        toAdd: input.toAdd,
        fromTime: input.fromTime,
        toTime: input.toTime,
        isEveryday: input.isEveryday
    };
    pickdropDao.addPickDrop(payload, condition, function (err, result) {
        if (err) {
            log.error("==>Error service/pickdrop-getPickDrops function ", err);
            return cb(err);
        }
        if (result == 1) {
            cb(null, "address added successfully !!");
        }
    });
}


function getPickDrops(condition, cb) {
    var jsonUser = [];
    pickdropDao.getPickDrops(condition, function (err, result) {
        if (err) {
            log.error("==>Error service/pickdrop-getPickDrops function ", err.message);
            return cb(err.message);
        }
        var users = result;
        if (users) {
            async.map(users, function (user) {
                var userObje = {
                    "id": user.id,
                    "name": user.name ? user.name : "",
                    "phone": user.phone ? user.phone : "",
                    "email": user.email ? user.email : "",
                    "imagePath": user.imagePath ? user.imagePath : "",
                    "fromAdd": user.fromAdd ? user.fromAdd : "",
                    "toAdd": user.toAdd ? user.toAdd : "",
                    "fromTime": user.fromTime ? user.fromTime : "",
                    "toTime": user.toTime ? user.toTime : "",
                    "isEveryday": user.isEveryday ? user.isEveryday : ""
                }
                jsonUser.push(userObje)
            });
            return cb(null, jsonUser);
        }
        return cb(null, null);
    });
}


module.exports = pickdrop;


