/*
 * @author devendra.rathore@47billion.com
 * The file contains authentication utils and middlewares to
 * ensure whether the user is authenticated or not.
 * */

require('rootpath')();
var config = require('config'),
    debug = require('debug')('app.helpers.auth'),
    moment = require('moment'),
    log = require('app/utils/logger')(module),
    jwt = require('jwt-simple');

var auth = {
    decodeToken: function (authorization, callback) {
        var token = authorization.split(' ')[1];
        try {
            var payload = jwt.decode(token, config.token.secret);
            callback(null, payload);
        }
        catch (err) {
            callback({message: err.message});
        }
    },
    /*Generate JSON Web Token*/
    createJWT: function (user) {
        var payload = {
            sub: user.id,
            role: user.phone
        };
        debug('--->JWT Payload - ', payload);

        return jwt.encode(payload, config.token.secret);
    },
    /*Authentication interceptor*/
    ensureAuthenticated: function (req, res, next) {
        if (!req.headers.authorization) {
            log.error('--->token not present');
            return res.status(401).send({message: 'Please make sure your request has an Authorization header'});
        }

        var tokenDetail;
        if (tokenDetail = req.headers.authorization.split(' ').length !== 2) {
            log.error('--->Invalid token');
            return res.status(401).json({message: "Invalid token"});
        }

        auth.decodeToken(req.headers.authorization, function (err, payload) {
            if (err) {
                log.error('--->Invalid token');
                return res.status(401).json({message: "Invalid token"});
            }
            if (payload.exp < moment().unix()) {
                return res.status(401).json({message: 'Expired token.'})
            }
            payload.id = payload.sub;
            req.user = payload;
            return next();
        });
    }
};

module.exports = auth;
