

var config = require('config'),
    log = require('app/utils/logger')(module),
    moment = require('moment'),
    idGenerator = require('app/helpers/id-generator'),
    debug = require('debug')('app.routes.driver'),
    M = require('app/models'),
    auth = require('app/helpers/auth');

var pickdrop = {
    addPickDrop: addPickDrop,
    getPickDrop: getPickDrop,
    getPickDropById: getPickDropById,
    updatePickDrop: updatePickDrop,
    searchRiderPick:searchRiderPick,
    searchRiderDrop:searchRiderDrop,
    searchPickTime:searchPickTime,
    searchDropTime:searchDropTime
}

function addPickDrop(req, res) {

    var input = req.body;
    var payload = {
        id: idGenerator.getNextId(),
        name: input.name,
        phone: input.phone,
        fromAdd: input.fromAdd,
        toAdd: input.toAdd,
        fromTime: input.fromTime,
        toTime: input.toTime,
        isEveryday: input.isEveryday,
        createdAt: moment().unix(),
        updatedAt: moment().unix()
    }
    M.Pickdrop.build(payload).save()
        .then(function (userSignup) {
            log.info("==>pickdrop added!!")
            return res.status(201).json({
                message: "user registered successfully !!",
                id: userSignup.id
            });
        }, function (err) {
            log.error("==>Error in added pickdrop", err)
            return res.status(200).json({message: "problme in in added pickdrop"});
        });
}

function getPickDrop(req, res) {
    var condition = {
        where: {isEveryday: "true"},
        attributes: ['id', 'name', 'phone', 'fromAdd', 'toAdd',
            'fromTime', 'toTime', 'isEveryday']
    };
    M.Pickdrop
        .findAll(condition)
        .then(function (user) {
            if (user != null) {
                return res.status(200).json(user);
            }
        }, function (error) {
            log.error("error in getting pickdrop data ", error.message);
            return res.status(200).json({message: "error in getting pick and drop add "});
        });
}

function getPickDropById(req, res) {
    var id = req.params.id;
    var condition = {
        where: {id: id, isEveryday: "true"},
        attributes: ['id', 'name', 'phone', 'fromAdd', 'toAdd',
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
        where: {id: id, isEveryday: "true"},
        attributes: ['id', 'name', 'phone', 'fromAdd', 'toAdd',
            'fromTime', 'toTime', 'isEveryday']
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
function searchRiderPick(req,res){
    var searchCriteria = req.query.pick;
    M.Pickdrop.searchAddForDrop(searchCriteria,function(err,result){
        if(err){
            return res.status(200).json({message: "error in getting pick  add"});
        }
        if(!result){
            return res.status(200).json(result);
        }
        else{
            return res.status(200).json({message:"No data found for given criteria"});
        }

    });

}


function searchRiderDrop(req,res){
    var searchCriteria = req.query.drop;
    M.Pickdrop.searchAddForDrop(searchCriteria,function(err,result){
        if(err){
            return res.status(200).json({message: "error in getting drop add"});
        }
        if(!result){
            return res.status(200).json({message:"No data found for given criteria"});
        }
        else{
            return res.status(200).json(result);
        }
    });

}


function searchPickTime(req,res){
    var searchCriteria = req.query.ptime;
    M.Pickdrop.searchTimeForPick(searchCriteria,function(err,result){
        if(err){
            return res.status(200).json({message: "error in getting drop add"});
        }
        if(!result){
            return res.status(200).json({message:"No data found for given criteria"});
        }
        else{
            return res.status(200).json(result);
        }
    });
}

function searchDropTime(req,res){
    var searchCriteria = req.query.dtime;
    M.Pickdrop.searchTimeForDrop(searchCriteria,function(err,result){
        if(err){
            return res.status(200).json({message: "error in getting drop add"});
        }
        if(!result){
            return res.status(200).json({message:"No data found for given criteria"});
        }
        else{
            return res.status(200).json(result);
        }
    });
}

module.exports = pickdrop;
