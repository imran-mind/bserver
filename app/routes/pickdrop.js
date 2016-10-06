var config = require('config'),
    log = require('app/utils/logger')(module),
    moment = require('moment'),
    idGenerator = require('app/helpers/id-generator'),
    debug = require('debug')('app.routes.driver'),
    M = require('app/models'),
    auth = require('app/helpers/auth'),
    async = require('async'),
    pickdropService = require('app/service/pickdrop'),
    common = require('app/routes/common');

var pickdrop = {
    addPickDrop: addPickDrop,
    getPickDrop: getPickDrop,
    getPickDropById: getPickDropById,
    updatePickDrop: updatePickDrop,
    searchRiderPick: searchRiderPick,
    searchRiderDrop: searchRiderDrop,
    searchPickTime: searchPickTime,
    searchDropTime: searchDropTime,
    searchPickDrop: searchPickDrop
}

function addPickDrop(req, res) {
    var input = req.body;
    var id = req.params.id;
    pickdropService.addPickDrop(input, id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({message: result});
    });
}

function getPickDrop(req, res) {
    var queryParams = req.query;
    var limit = queryParams.count ? queryParams.count : 15;
    var offset = queryParams.start ? queryParams.start : 0;

    var orderByClause;
    if ((queryParams || {}).order && (queryParams || {}).type) {
        orderByClause = common.mapOrderByFields(queryParams.order.trim(),
            queryParams.type.trim());
    }
    var searchTyp = queryParams.type ? queryParams.type : 'pick';
    var data = queryParams.data ? queryParams.data : '';
    var searchQuery = common.generateQuery(queryParams);
    var condition = {
        offset: offset,
        limit: limit,
        order: orderByClause,
        where: searchQuery
    };
    pickdropService.getPickDrops(condition, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({message: result});
    });
}


function getPickDropById(req, res) {
    var id = req.params.id;
    var condition = {
        where: {id: id},
        attributes: ['id', 'name', 'phone', 'email', 'fromAdd', 'toAdd',
            'fromTime', 'toTime', 'isEveryday']
    };
    M.Pickdrop
        .findOne(condition)
        .then(function (user) {
            if (user != null) {
                return res.status(200).json(user);
            }
            else {
                return res.status(200).json({message: "pick and drop address does not exist for this id " + id})
            }
        }, function (error) {
            log.error("error in getting pickdrop data ", error.message);
            return res.status(200).json({message: "error in getting pick and drop add "});
        });
}


function updatePickDrop(req, res) {
    var id = req.params.id;
    var input = req.body;
    var condition = {
        where: {id: id}
    };

    var payload = {
        name: input.name,
        phone: input.phone,
        fromAdd: input.fromAdd,
        toAdd: input.toAdd,
        fromTime: input.fromTime,
        toTime: input.toTime,
        isEveryday: input.isEveryday,
        updatedAt: moment().unix()
    }
    M.Pickdrop
        .findOne(condition)
        .then(function (user) {
            if (user != null) {
                M.Pickdrop.update(payload, condition)
                    .then(function (result) {
                        res.status(200).json({message: "updated successfully !!"})
                    }, function (err) {
                        log.error('error in dao delete driver', err);
                    });
            }
            else {
                return res.status(200).json({message: "pick and drop address does not exist for this id " + id})
            }
        }, function (error) {
            log.error("error in getting pickdrop data ", error.message);
            return res.status(200).json({message: "error in getting pick and drop add "});
        });
}

//http://localhost:8080/api/v1/searchadd?add=patni pura
function searchRiderPick(req, res) {
    var searchCriteria = req.query.pick;
    M.Pickdrop.searchAddForPick(searchCriteria, function (err, result) {
        if (err) {
            return res.status(200).json({message: "error in getting pick  add"});
        }
        if (result == 0) {
            return res.status(200).json({message: "No data found for given criteria"});
        }
        else {
            return res.status(200).json(result);
        }

    });

}


function searchRiderDrop(req, res) {
    var searchCriteria = req.query.drop;
    M.Pickdrop.searchAddForDrop(searchCriteria, function (err, result) {
        if (err) {
            return res.status(200).json({message: "error in getting drop add"});
        }
        if (result == 0) {
            return res.status(200).json({message: "No data found for given criteria"});
        }
        else {
            return res.status(200).json(result);
        }
    });

}


function searchPickTime(req, res) {
    var searchCriteria = req.query.ptime;
    M.Pickdrop.searchTimeForPick(searchCriteria, function (err, result) {
        if (err) {
            return res.status(200).json({message: "error in getting drop add"});
        }
        if (result == 0) {
            return res.status(200).json({message: "No data found for given criteria"});
        }
        else {
            return res.status(200).json(result);
        }
    });
}

function searchDropTime(req, res) {
    var searchCriteria = req.query.dtime;
    M.Pickdrop.searchTimeForDrop(searchCriteria, function (err, result) {
        if (err) {
            return res.status(200).json({message: "error in getting drop add"});
        }
        if (result == 0) {
            return res.status(200).json({message: "No data found for given criteria"});
        }
        else {
            return res.status(200).json(result);
        }
    });
}


function searchPickDrop(req, res) {
    var queryParam = req.query;
    var pick = queryParam.pick ? queryParam.pick : "";
    var drop = queryParam.drop ? queryParam.drop : "";
    var jsonUser = [];
    var condition = {
        where: {
            $and: [
                {
                    fromAdd: {
                        $iLike: '%' + pick + '%'
                    }
                },
                {
                    toAdd: {
                        $iLike: '%' + drop + '%'
                    }
                }
            ]
        }
    };

    M.Pickdrop
        .findAll(condition)
        .then(function (users) {
            if (users != null) {
                async.map(users, function (user) {
                    var userObje = {
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
                    jsonUser.push(userObje);
                });
                return res.status(200).json(jsonUser);
            }
        }, function (error) {
            log.error("error in searching pickdrop data ", error.message);
            return res.status(500).json({message: "error in getting pick and drop add " + error.message});
        });

}
module.exports = pickdrop;
