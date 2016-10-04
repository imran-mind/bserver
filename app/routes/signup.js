var config = require('config'),
    log = require('app/utils/logger')(module),
    moment = require('moment'),
    idGenerator = require('app/helpers/id-generator'),
    debug = require('debug')('app.routes.driver'),
    M = require('app/models'),
    auth = require('app/helpers/auth'),
    common = require('app/routes/common');

var signup = {
    doSignup: doSignup,
    doLogin: doLogin
}

function doSignup(req, res) {
    var input = req.body;
    log.info("==>invoking doSignup function");
    var userId = idGenerator.getUserId();
    var payload = {
        "id": userId,
        "name": input.name,
        "phone": input.phone,
        "email": input.email,
        "password": input.password,
        "createdAt": moment().unix(),
        "updatedAt": moment().unix()
    }
    var condition = {
        where: {phone: input.phone}
    }
    M.Pickdrop
        .findOne(condition)
        .then(function (user) {
            if (user) {
                return res.status(200).json({message: "user already exist with this phone no " + input.phone});
            }
            if (user === null) {
                M.Pickdrop.build(payload).save()
                    .then(function (userSignup) {
                        log.info("==>user registered !!")
                        /*var token = auth.createJWT(userSignup);*/
                        common.getBucketUrl(input.phone, function (err, url) {
                            if (err) {
                                log.error("==>Error in registering user", err)
                                return res.status(500).json({
                                    message: "something went wrong in image uploading",
                                    status: 500
                                });
                            }
                            M.Pickdrop.update({imagePath: url}, condition)
                                .then(function (result) {
                                    return res.status(201).json({
                                        status: 201,
                                        message: "user registered successfully !!",
                                        id: userId,
                                        name: input.name,
                                        phone: input.phone,
                                        email: input.email,
                                        imageUrl: url
                                        /*token: token*/
                                    });
                                }, function (err) {
                                    log.error('error in dao delete driver', err);
                                });
                        });

                    }, function (err) {
                        log.error("==>Error in registering user", err)
                        return res.status(500).json({
                            message: "problme in registring user",
                            status: 500
                        });
                    });
            }
        })
}


function doLogin(req, res) {
    var input = req.body;
    var email = input.email;
    var password = input.password;
    log.info("===>invoking doLogin function");

    M.Pickdrop
        .findOne({
            where: {email: email, password: password}
        })
        .then(function (user) {
            if (user != null) {
                var jsonUser = {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "phone": user.phone,
                    "imagePath": user.imagePath ? user.imagePath : "",
                    "fromAdd": user.fromAdd ? user.fromAdd : "",
                    "toAdd": user.toAdd ? user.toAdd : "",
                    "fromTime": user.fromTime ? user.fromTime : "",
                    "toTime": user.toTime ? user.toTime : "",
                    "isEveryday": user.isEveryday ? user.isEveryday : true
                }
                return res.status(200).json(jsonUser);
            }
            return res.status(200).json({message: "username or password incorrect"});
        }, function (err) {
            return res.status(500).json({message: "Error in login " + err.message});
        });
}
module.exports = signup;
