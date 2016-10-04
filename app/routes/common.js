/**
 * Created by imran on 5/10/16.
 */

var config = require('config'),
    AWS = require('aws-sdk');

var debug = require('debug')('app.routes.common');
log = require('app/utils/logger')(module);

var s3 = new AWS.S3({
    Bucket: config.aws.bucket,
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
    computeChecksums: true
});

//S3 Configurations
AWS.config.region = config.aws.region;


var common = {
    generateQuery: generateQuery,
    getBucketUrl: getBucketUrl
};


function generateQuery(object) {
    var query = {};
    async.map(Object.keys(object), function (field) {
        switch (field) {
            case 'severity':
                if (object[field].trim() !== '') {
                    query.severity = {$iLike: '%' + object[field].trim() + '%'};
                }
                break;
            case 'category':
                if (object[field].trim() !== '') {
                    query.category = {$iLike: '%' + object[field].trim() + '%'};
                }
                break;
            case 'acknowledged':
                if (object[field].trim() !== '') {
                    query.acknowledged = object[field].trim();
                }
                break;
            case 'description':
                if (object[field].trim() !== '') {
                    query.description = {$iLike: '%' + object[field].trim() + '%'};
                }
                break;
        }
    });
    return query;
}


function getBucketUrl(fileName, cb) {
    log.info('=======>invoking getBucketUrl');

    if (!fileName) {
        return 'please provide file name';
    }

    var keyJpg = 'user/' + fileName + '.jpg';
    var params = {
        Bucket: config.aws.bucket,
        Key: keyJpg,
        ContentType: 'image/jpg',
        Expires: config.aws.expiry,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', params, function (err, url) {
        if (err) {
            log.error('==>Error in getting signedUrl', err);
            return cb(err);
        }
        log.info('==>signedUrl', url);
        return cb(null, url);
    });

}


module.exports = common;
