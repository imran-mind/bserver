'use strict'
/*
 * @author devendra.rathore@47billion.com
 * The file contains all the endpoints existing into the system.
 * */

var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    signup = require('app/routes/signup'),
    pickdrop = require('app/routes/pickdrop');



router.post('/api/v1/signup', signup.doSignup);
router.post('/api/v1/pdadd',pickdrop.addPickDrop);
router.get('/api/v1/pdadd',pickdrop.getPickDrop);
router.get('/api/v1/pdadd/:id',pickdrop.getPickDropById);
router.put('/api/v1/pdadd/:id',pickdrop.updatePickDrop);
router.get('/api/v1/searchpick',pickdrop.searchRiderPick);
router.get('/api/v1/searchdrop',pickdrop.searchRiderDrop);
router.get('/api/v1/searchpt',pickdrop.searchPickTime);
router.get('/api/v1/searchdt',pickdrop.searchDropTime);

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
        .use(express.static(path.join(__dirname, '/../../../dashboard')))
        .use(require('morgan')('combined', {"stream": logger.stream}))
        .use(bodyParser.json({limit: '5mb'}))

        .use(express.static('apidoc'))
        .use(bodyParser.urlencoded({extended: false}))
    return router;
}
