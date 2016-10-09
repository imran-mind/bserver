'use strict'


var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    signup = require('app/routes/signup'),
    pickdrop = require('app/routes/pickdrop');


router.post('/api/v1/signup', signup.doSignup);
router.post('/api/v1/login', signup.doLogin);
router.put('/api/v1/pdadd/:id', pickdrop.addPickDrop);
router.get('/api/v1/pdadd/search', pickdrop.getPickDrop);
router.get('/api/v1/pdadd/:id', pickdrop.getPickDropById);

module.exports = function (app) {
    app
        .all('/*', function (req, res, next) {
            // CORS headers
            res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
            res.header('Access-Control-Allow-Credentials', true);
            res.header('Authorization', true);
            // Set custom headers for CORS
            res.header('Access-Control-Allow-Headers', 'Origin,Content-type,X-Requested-With,Accept,Authorization,X-Token');
            if (req.method == 'OPTIONS') {
                res.status(200).end();
            } else {
                next();
            }
        })
        .all('/api/v1/*', [])
        .use(express.static(path.join(__dirname, '/../../../')))
        .use(require('morgan')('combined', {"stream": logger.stream}))
        .use(bodyParser.json({limit: '5mb'}))

        .use(express.static('apidoc'))
        .use(bodyParser.urlencoded({extended: false}))
    return router;
}
