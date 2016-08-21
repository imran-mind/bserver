var Joi = require('joi');
var schema;

function log(err, value) {
    value = JSON.stringify(value);

    if (err) {
        console.log('\033[41mFAILED\033[49m ' + value + ' - ' + JSON.stringify(err, null, 2));
    } else {
        console.log('\033[42mOK\033[49m ' + value);
    }
    console.log('\n\n');
}


var schema = Joi.object().keys({
    i: Joi.number().integer().required(),
    f: Joi.number().required(),
    p: Joi.number().required(),
    n: Joi.string().required(),
    c: Joi.string(),
    bd: Joi.object().when('n', {is: 'TAG', then: Joi.required(), otherwise: Joi.any()})
});


// n=SPOTX; bd is empty ===> This will succeed.
//Joi.validate({"bids":[{"i":23,"f":0,"p":5,"c":"-","s":2,"n":"TAG", "g":12,"bd": {"320x480": "http://cdn.adnxs.com/p/71/62/e9/2e/7162e92e0cb8fdb00a5d69fb7cc50510.png"}}]}, schema, {
//    allowUnknown: true
//}, log);
//
//
//// n=SPOTX; bd is present ===> This will succeed.
//Joi.validate({"bids":[{"i":22,"f":0,"p":5,"c":"-","s":2,"n":"TAG","g":12, "bd": {"vast_xml": "<VAST version=\"2.0\"></VAST>"}}]}, schema, {
//    allowUnknown: true
//}, log);
//
//
//// n=TAG; bd is present ===> This will succeed.
//Joi.validate({"i":21,"f":0,"p":5,"c":"-","s":2,"n":"TAG","g":12, "bd": {"vast_tag": "http://ec2-184-72-178-33.compute-1.amazonaws.com/med/samplevast/linear"}}, schema, {
//    allowUnknown: true
//}, log);

// n=TAG; bd is empty or not having channel_id ===> This will fail.
Joi.validate({"i": 6, "f": 4.5, "p": 5, "c": "US", "s": 2, "n": "TAG", "bd": {}}, schema, {
    allowUnknown: true
}, log);

// n=TAG; bd is null ===> This will fail.

//
//
//function validate(bid){
//    Joi.validate(bid , schema, {
//        allowUnknown: true
//    }, function(err, value){
//        if(err){
//            console.log('INVALIDDDD');
//        }else{
//            console.log('VALID');
//        }
//        return err ? false : true;
//    });
//}
//
//validate({"i":21,"f":0,"p":5,"c":"-","s":2,"n":"TAG","g":12, "bd": {"vast_tag": "http://ec2-184-72-178-33.compute-1.amazonaws.com/med/samplevast/linear"}});


var bids = [{"i": 6, "f": 4.5, "p": 5, "c": "US", "s": 2, "n": "TAG", "bd": {}}, {
    "i": 23,
    "f": 0,
    "p": 5,
    "c": "-",
    //"s": 3,
    "n": "TAG",
    "g": 12,
    "bd": {"320x480": "http://cdn.adnxs.com/p/71/62/e9/2e/7162e92e0cb8fdb00a5d69fb7cc50510.png"}
}];


var _ = require('lodash');

var segments = _.pluck(_.uniq(bids, 's'), 's');

console.log(segments);

segments.forEach(function (s) {
    if(s){
        console.log('---->',s);
    }
});

function membership(segments, device, callback) {
    var memberships = {};
    var multiCommands = [];

    segments.forEach(function (s) {
        if(s){
            multiCommands.push(['SISMEMBER', 'pg:segments:' + s, device]);
        }
    });
    redisClient
        .multi(multiCommands)
        .exec(function (err, results) {
            if (err) {
                return callback(err);
            }
            var resultCount = results.length;
            for (var i = 0; i < resultCount; i++) { //TODO - check for error in results here.
                memberships[segments[i]] = results[i] ? true : false;
            }
            callback(null, memberships);
        });
}
