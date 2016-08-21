

require('rootpath')();
var config = require('config'),
    debug = require('debug')('app.helpers.auth'),
    moment = require('moment'),
    log = require('app/utils/logger')(module),
    jwt = require('jwt-simple');

var auth = {

    /*Generate JSON Web Token*/
    createJWT: function (user) {
        var payload = {
            sub: user.id,
            role: user.phone
        };
        debug('--->JWT Payload - ', payload);

        return jwt.encode(payload, config.token.secret);
    }

};

module.exports = auth;
