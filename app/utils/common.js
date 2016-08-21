/**
 * @author: vinayak.sharan@47billion.com
 * This file contains the common functions which are shared among the resources.
 */

var async = require('async');
var M = require('app/models'),
    C = require('app/helpers/constant');

var common = {
    registeredDriverDetails: registeredDriverDetails,
    registeredDriversCount: registeredDriversCount,
    driverRiderMeta: driverRiderMeta,
    mapOrderByFields: mapOrderByFields,
    findSearchTerm: findSearchTerm,
    filterData: filterData,
    searchInProcessDrivers: searchInProcessDrivers,
    filterDriversByTerm: filterDriversByTerm
};


function mapOrderByFields(order, type) {
    switch (order) {
        case 'id':
            return 'id ' + type.toUpperCase();
            break;
        case 'requestOn':
            return 'request_on ' + type.toUpperCase();
            break;
        case 'vehicleType':
            return 'vehicle_type ' + type.toUpperCase();
            break;
        case 'disPickupDrop':
            return 'dis_pickup_drop ' + type.toUpperCase();
            break;
        case 'riderFeedbackRating':
            return 'rider_feedback_rating >= 0 ' + type.toUpperCase();
            break;
        case 'firstName':
            return 'first_name ' + type.toUpperCase();
            break;
        case 'phone':
            return 'phone ' + type.toUpperCase();
            break;
        case 'vehicle':
            return 'vehicle ' + type.toUpperCase();
            break;
        case 'type':
            return 'vehicle_type ' + type.toUpperCase();
            break;
        default:
            return 'd.last_updated DESC ';
            break;
    }
}


function findSearchTerm(term) {//search for registered driver

    var terms = term.split('|');
    var type = terms[0];
    var searchKey = terms[1];
    var termToSearch = '';

    switch (type) {
        case 'id':
            termToSearch = " AND (d.id like LOWER(\'%" + searchKey + "%\'))"
            break;
        case 'name':
            searchKey = searchKey.replace(/ /g, "%");
            termToSearch = " AND (LOWER(CONCAT_WS(' ', first_name, middle_name, last_name)) like LOWER(\'%" + searchKey + "%\')) "
            break;
        case 'phone':
            termToSearch = " AND (d.phone like \'%" + searchKey + "%\')"
            break;
        case 'vehicle':
            searchKey = searchKey.replace(/ /g, "%");
            termToSearch = " AND (LOWER(d.vehicle) like LOWER(\'%" + searchKey + "%\')) "
            break;
        case 'vehicleType':
            termToSearch = " AND (LOWER(d.vehicle_type) like LOWER(\'%" + searchKey + "%\')) "
            break;
        /*case 'state':
         termToSearch = " AND (d.state like \'%" + searchKey + "%\')"
         break;*/
        case 'feedbackRating':
            termToSearch = " AND (t.rider_feedback_rating >=" + searchKey + " "
            break;
        case 'trip':
            termToSearch = " AND (LOWER(t.id) like LOWER(\'%" + searchKey + "%\'))"
            break;
        case 'rname':
            searchKey = searchKey.replace(/ /g, "%");
            termToSearch = " AND (LOWER(CONCAT_WS(' ', r.first_name, r.last_name)) like LOWER(\'%" + searchKey + "%\')) "
            break;
        case 'rphone':
            termToSearch = " AND (r.phone like \'%" + searchKey + "%\') "
            break;
        case 'pickUp':
            searchKey = searchKey.replace(/,/g, "");
            searchKey = searchKey.replace(/ /g, "%");
            searchKey = searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "");
            termToSearch = " AND (LOWER((select regexp_replace(loc_pickup_actual->'line1', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_pickup_actual->'line2', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_pickup_actual->'city', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_pickup_actual->'state', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_pickup_actual->'country', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\')) "//" WHERE LOWER(t.pickup) like LOWER(\'%" + searchKey + "%\') ";
            break;
        case 'drop':
            searchKey = searchKey.replace(/,/g, "");
            searchKey = searchKey.replace(/ /g, "%");
            searchKey = searchKey.replace(/[-\/\\^$*+?.()|[\]{}]/g, "");
            termToSearch = " AND (LOWER((select regexp_replace(loc_drop_actual->'line1', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_drop_actual->'line2', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_drop_actual->'city', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_drop_actual->'state', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\') " +
            "OR LOWER((select regexp_replace(loc_drop_actual->'country', '[^a-zA-Z0-9]', '', 'g'))) like LOWER(\'%" + searchKey + "%\')) "//" WHERE LOWER(t.pickup) like LOWER(\'%" + searchKey + "%\') ";
            break;
        case 'amount':
            if (isNumber(searchKey)) {
                termToSearch = " AND (t.final_fare >= " + searchKey + ") ";
            }
            break;
        case 'riderFeedbackRating':
            if (isNumber(searchKey)) {
                termToSearch = " AND (t.rider_feedback_rating >= " + searchKey + ") ";
            }
            break;
        default:
            termToSearch = " AND (LOWER(CONCAT_WS(' ', first_name, middle_name, last_name)) like LOWER(\'%" + term + "%\') OR d.phone like \'%" + term + "%\' OR LOWER(d.vehicle) like LOWER(\'%" + term + "%\') OR LOWER(d.vehicle_type) like LOWER(\'%" + term + "%\'))  " //OR t.rider_feedback_rating >=" + term;
            break;
    }
    return termToSearch;
}

function filterData(filterParam) {
    return " AND t.vehicle_type=\'" + filterParam.toLowerCase() + "\'";
}


function searchInProcessDrivers(term) {
    var terms = term.split('|');
    var type = terms[0];
    var searchKey = terms[1];
    var termToSearch;

    switch (type) {
        case 'name':
            searchKey = searchKey.replace(/ /g, "%");
            termToSearch = " AND (LOWER(CONCAT_WS(' ', first_name, middle_name, last_name)) like LOWER(\'%" + searchKey + "%\')) "
            break;
        case 'phone':
            termToSearch = " AND (contacts->>'primary' like \'%" + searchKey + "%\') "
            break;
        case 'vehicle':
            searchKey = searchKey.replace(/ /g, "%");
            termToSearch = " AND (LOWER(vehicle) like LOWER(\'%" + searchKey + "%\')) "
            break;
        case 'vehicleType':
            termToSearch = " AND (LOWER(vehicle_type) like LOWER(\'%" + searchKey + "%\')) "
            break;
        default:
            termToSearch = " AND (LOWER(CONCAT_WS(' ', first_name, middle_name, last_name)) like LOWER(\'%" + term + "%\') OR contacts->>'primary' like \'%" + term + "%\' OR LOWER(vehicle) like LOWER(\'%" + term + "%\') OR LOWER(vehicle_type) like LOWER(\'%" + term + "%\'))  "
            break;
    }
    return termToSearch;
}

function filterDriversByTerm(filterTerm) {
    var filterBy = " ";
    if ((filterTerm || {}).filterByVehicle) {
        filterBy = " AND LOWER(d.vehicle_type) = LOWER(\'" + filterTerm.filterByVehicle + "\') ";
    }
    return filterBy;
}


function registeredDriverDetails(offset, limit, today, orderByClause, whereClause, filterByState, cb) {

    var driverDetails = {};
    M.Driver.driverDetails(offset, limit, today, orderByClause, whereClause, filterByState, function (err, data) {
        async.map(data, function (dataObj) {
            var driver = driverDetails[dataObj.id];
            if (!driver) {
                driver = {
                    id: dataObj.id,
                    name: dataObj.name ? dataObj.name : '',
                    phone: dataObj.phone ? dataObj.phone : '',
                    vehicle: dataObj.vehicle ? dataObj.vehicle : '',
                    vehicleType: dataObj.type ? dataObj.type : '',
                    joinedOn: dataObj.joinon ? dataObj.joinon : 0,
                    ridesToday: dataObj.ride ? parseInt(dataObj.ride) : 0,
                    ridesTotal: dataObj.rides ? parseInt(dataObj.rides) : 0,
                    feedbackRating: dataObj.rating ? dataObj.rating : 0,
                    earnedTotal: dataObj.fare ? dataObj.fare : 0,
                    state: dataObj.state ? dataObj.state : 10,
                    city: dataObj.city ? dataObj.city : '',
                    profileImage: dataObj.pimage ? C.IMAGE.PROFILE_IMAGE + dataObj.pimage : ''
                };
            }
            driverDetails[dataObj.id] = driver;
        });
        /*console.log("#################################",driverDetails);*/
        return cb(null, driverDetails);
    });
}


function registeredDriversCount(whereClause, filterByState, cb) {
    M.Driver.driverCount(whereClause, filterByState, function (err, data) {
        if (err) {
            return cb(err);
        }
        return cb(null, parseInt(data[0].count));
    });
}


function driverRiderMeta(req, cb) {
    var today = (req.query || {}).today ? req.query.today : moment().startOf('day').unix();
    async.parallel({
        drivers: function (cb) {
            req.app.get('models').Driver
                .driversInfo(function (err, data) {
                    if (err) {
                        log.error(err);
                        return cb(err);
                    }
                    var driverTripStats = {};
                    async.map(data, function (dataObj) {
                        var id = dataObj.id;

                        var driverTripStat = driverTripStats[id];

                        if (!driverTripStat) {
                            driverTripStat = {
                                id: id,
                                ridesTotal: 0,
                                fare: 0,
                                name: dataObj.name,
                                profileImage: dataObj.pimage ? C.IMAGE.PROFILE_IMAGE + dataObj.pimage : '',
                                avg: 0,
                                ridesToday: 0,
                                phone: dataObj.phone,
                                state: dataObj.state,
                                vehicle: dataObj.vehicle,
                                type: dataObj.type,
                                joinedOn: dataObj.joinon ? dataObj.joinon : 0,
                                city: dataObj.city ? dataObj.city : ''
                            };
                            driverTripStats[id] = driverTripStat;
                        }

                        driverTripStat.ridesTotal += parseInt(dataObj.rides);
                        driverTripStat.fare = dataObj.fare ? dataObj.fare + driverTripStat.fare : driverTripStat.fare;
                        driverTripStat.avg = (parseFloat(dataObj.avg) + parseFloat(driverTripStat.avg)) / 2;

                        //Is today's ride?
                        if (dataObj.date >= today) {
                            driverTripStat.ridesToday += parseInt(dataObj.rides);
                        }
                    });
                    return cb(null, driverTripStats);
                })
        },
        riders: function (cb) {
            req.app.get('models').Rider
                .allRides(function (err, rides) {
                    if (err) {
                        log.error(err);
                        return cb(err);
                    }
                    var riderTripStats = {};
                    async.map(rides, function (dataObj) {
                        var id = dataObj.id;
                        var riderTripStat = riderTripStats[id];

                        if (!riderTripStat) {
                            riderTripStat = {
                                id: id,
                                name: dataObj.name,
                                phone: dataObj.phone,
                                email: dataObj.email ? dataObj.email : '',
                                gender: dataObj.gender ? dataObj.gender : '',
                                age: dataObj.age ? dataObj.age : 0,
                                profileImage: dataObj.pimage ? C.IMAGE.PROFILE_IMAGE + dataObj.pimage : '',
                                ridesToday: 0,
                                ridesTotal: 0

                            };
                            riderTripStats[id] = riderTripStat;
                        }

                        riderTripStat.ridesTotal += parseInt(dataObj.rides);

                        //Is today's ride?
                        if (dataObj.date >= today) {
                            riderTripStat.ridesToday += parseInt(dataObj.rides);
                        }

                    });
                    return cb(null, riderTripStats);
                })
        }
    }, function (err, result) {
        return cb(err, result);
    });

}


function saveTocsv(req, res, next) {
    var queryParams = req.query;
    var today = (req.query || {}).today ? req.query.today : moment().startOf('day').unix();
    var orderByClause = 'd.id', offset, limit, whereClause = ' ';
    offset = queryParams.start - 1;
    limit = queryParams.count ? ' LIMIT ' + queryParams.count : ' ';
    if ((queryParams || {}).order && (queryParams || {}).type) {
        orderByClause = mapOrderByFields(queryParams.order, queryParams.type)
    }
    if ((queryParams || {}).term) {
        whereClause = findSearchTerm(queryParams.term);
    }
    var filterByState = '';
    if ((queryParams || {}).filterByStatus) {
        if (queryParams.filterByStatus === 'occupied') {
            filterByState += " WHERE details.state IN(" + [C.DRIVER.STATE_AT_PICKUP, C.DRIVER.STATE_IN_TRIP, C.DRIVER.STATE_FOR_TRIP, C.DRIVER.STATE_ALLOCATED] + ") ";
        } else if (queryParams.filterByStatus === 'unoccupied') {
            filterByState += " WHERE details.state IN(" + [C.DRIVER.STATE_ONLINE] + ") ";
        } else if (queryParams.filterByStatus === 'offline') {
            filterByState += " WHERE details.state IN(" + C.DRIVER.STATE_OFFLINE + ") ";
        }
    }

    whereClause += filterDriversByTerm(queryParams);

    var fields = ['id',
        'name',
        'phone',
        'vehicle',
        'vehicleType',
        'joinedOn',
        'ridesToday',
        'ridesTotal',
        'feedbackRating',
        'earnedTotal',
        'state',
        'city'];

    var driverData = {};
    var dbData = [];
    req.app.get('models').Driver
        .driverDetails(offset, limit, today, orderByClause, whereClause, filterByState, function (err, data) {
            async.map(data, function (objData) {
                driverData = {
                    id: objData.id,
                    name: objData.name,
                    phone: objData.phone,
                    vehicle: objData.vehicle,
                    vehicleType: objData.vehicleType,
                    joinedOn: moment.unix(objData.joinedOn).format("DD/MM/YYYY"),
                    ridesToday: objData.ridesToday,
                    ridesTotal: objData.ridesTotal,
                    feedbackRating: objData.feedbackRating,
                    earnedTotal: objData.earnedTotal,
                    state: objData.state,
                    city: objData.city
                };
                dbData.push(driverData);
            });

            json2csv({data: dbData, fields: fields}, function (err, csv) {
                if (err) {
                    log.error(err);
                }
                res.setHeader('Content-disposition', 'attachment; filename=driver.csv');
                res.setHeader('Content-type', 'text/csv');
                res.write(csv);
                res.end();
            })
        });
}

module.exports = common;
