
var config = require('config'),
    log = require('app/utils/logger')(module),
    moment = require('moment'),
    idGenerator = require('app/helpers/id-generator'),
    debug = require('debug')('app.routes.driver'),
    M = require('app/models'),
    auth = require('app/helpers/auth');
var signup = {
    doSignup: doSignup
}

function doSignup(req, res) {
    var input = req.body;
    console.log(input);
    var userId = idGenerator.getUserId();
    var payload = {
        "id": userId,
        "name": input.name,
        "phone": input.phone,
        "email": input.email,
        "createdAt": moment().unix(),
        "updatedAt": moment().unix()
    }
    M.Signup
        .findOne({
            where: {phone: input.phone}
        })
        .then(function (user) {
            if (user) {
                return res.status(200).json({message: "user already exist with this phone no " + input.phone});
            }
            if (user === null) {
                M.Signup.build(payload).save()
                    .then(function (userSignup) {
                        log.info("==>user registered !!")
                        var token = auth.createJWT(userSignup);
                        return res.status(201).json({
                            message: "user registered successfully !!",
                            id: userId,
                            name: input.name,
                            phone: input.phone,
                            email: input.email,
                            token: token
                        });
                    }, function (err) {
                        log.error("==>Error in registering user", err)
                        return res.status(200).json({message: "problme in registring user"});
                    });
            }
        })
}

module.exports = signup;
