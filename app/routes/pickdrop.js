var config = require('config'),
    log = require('app/utils/logger')(module),
    moment = require('moment'),
    idGenerator = require('app/helpers/id-generator'),
    debug = require('debug')('app.routes.driver'),
    M = require('app/models'),
    auth = require('app/helpers/auth'),
    async = require('async'),
    pickdropService = require('app/service/pickdrop'),
    common = require('app/routes/common'),
    merge = require('merge');

var pickdrop = {
    addPickDrop: addPickDrop,
    getPickDrop: getPickDrop,
    getPickDropById: getPickDropById
}

function addPickDrop(req, res) {
    var input = req.body;
    var id = input.id;
    pickdropService.addPickDrop(input, id, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({message: result});
    });
}

function getPickDrop(req, res) {
    var queryParams = req.query;
    var id = parseInt(queryParams.userId);
    var limit = queryParams.count ? queryParams.count : 15;
    var offset = queryParams.start ? queryParams.start : 0;

    console.log('id ************' + id);
    var searchTyp, data, searchQuery, drop, pick, searchPickDrop;
    var orderByClause;
    if ((queryParams || {}).order && (queryParams || {}).type) {
        orderByClause = common.mapOrderByFields(queryParams.order.trim(),
            queryParams.otype.trim());
    }
    if ((queryParams || {}).type && (queryParams || {}).data) {
        searchTyp = queryParams.type;
        data = queryParams.data;
        searchQuery = common.generateQuery(searchTyp, data);
    }
    if ((queryParams || {}).pick && (queryParams || {}).drop) {
        pick = queryParams.pick ? queryParams.pick : "";
        drop = queryParams.drop ? queryParams.drop : "";
        searchPickDrop = {
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
        };
    }
    var userId = {
        id: {
            $ne: id
        }
    };
    var condition = {
        offset: offset,
        limit: limit,
        order: orderByClause,
        where: merge(searchQuery, userId, searchPickDrop)
    };
    pickdropService.getPickDrops(condition, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        if (!result || result.length <= 0) {
            return res.status(403).json({message: "No Data found"});
        }
        return res.status(200).json(result);
    });
}


function getPickDropById(req, res) {
    var id = req.params.id;
    var condition = {
        where: {id: id},
        attributes: ['id', 'name', 'phone', 'email', 'imagePath', 'fromAdd', 'toAdd',
            'fromTime', 'toTime', 'isEveryday']
    };
    pickdropService.getPickDropById(condition, function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
        if (!result || result.length <= 0) {
            return res.status(403).json({message: "No Data found"});
        }
        return res.status(200).json(result);
    });
}

/*
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


 function searchPickDrop(req, res) {
 var queryParams = req.query;
 var id = parseInt(queryParams.userId);
 var drop, pick;
 if ((queryParams || {}).pick && (queryParams || {}).drop) {
 pick = queryParams.pick ? queryParams.pick : "";
 drop = queryParams.drop ? queryParams.drop : "";
 }
 var condition = {
 where: {
 $or: [
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
 ],
 id: {
 $ne: id
 }
 }
 };
 pickdropService.searchPickDrop(condition, function (err, result) {
 if (err) {
 return res.status(500).json(err);
 }
 if (!result || result.length <= 0) {
 return res.status(403).json({message: "No Data found"});
 }
 return res.status(200).json(result);
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
 */

module.exports = pickdrop;
