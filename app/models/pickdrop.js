var log = require('app/utils/logger')(module);
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pickdrop', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.TEXT,
            field: 'name'
        },
        phone: {
            type: DataTypes.TEXT,
            field: 'phone',
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.TEXT,
            field: 'email'
        },
        imagePath: {
            type: DataTypes.TEXT,
            field: 'image_path'
        },
        gender: {
            type: DataTypes.TEXT,
            field: 'gender'
        },
        password: {
            type: DataTypes.TEXT,
            field: 'password'
        },
        fromAdd: {
            type: DataTypes.TEXT,
            field: 'from_add'
        },
        toAdd: {
            type: DataTypes.TEXT,
            field: 'to_add'
        },
        fromTime: {
            type: DataTypes.TEXT,
            field: 'from_time'
        },
        toTime: {
            type: DataTypes.TEXT,
            field: 'to_time'
        },
        isEveryday: {
            type: DataTypes.TEXT,
            field: 'is_everyday'
        },
        createdAt: {
            type: DataTypes.BIGINT,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.BIGINT,
            field: 'updated_at'
        }
    }, {
        freezeTableName: true,
        classMethods: {
            searchAddForPick: function (sarch, cb) {
                var query = "select id,name,phone,from_add,to_add,from_time,to_time from pickdrop where from_add ILIKE '" + "%" + sarch + "%" + "';";
                sequelize.query(query,
                    {type: sequelize.QueryTypes.RAW})
                    .then(function (data) {
                        return cb(null, data[0]);
                        log.info('===>' + data[0]);
                    }, function (err) {
                        log.error('=>pickdrop Model ,Failed to process query overviewTrip function', err);
                        return cb(err);
                    })
            },
            searchAddForDrop: function (sarch, cb) {
                var query = "select id,name,phone,from_add,to_add,from_time,to_time from pickdrop where to_add ILIKE '" + "%" + sarch + "%" + "';";
                sequelize.query(query,
                    {type: sequelize.QueryTypes.RAW})
                    .then(function (data) {
                        return cb(null, data[0]);
                        log.info('===>' + data[0]);
                    }, function (err) {
                        log.error('=>pickdrop Model ,Failed to process query overviewTrip function', err);
                        return cb(err);
                    })
            },
            searchTimeForPick: function (sarch, cb) {
                var query = "select id,name,phone,from_add,to_add,from_time,to_time from pickdrop where from_time ILIKE '" + "%" + sarch + "%" + "';";
                sequelize.query(query,
                    {type: sequelize.QueryTypes.RAW})
                    .then(function (data) {
                        return cb(null, data[0]);
                        log.info('===>' + data[0]);
                    }, function (err) {
                        log.error('=>pickdrop Model ,Failed to process query overviewTrip function', err);
                        return cb(err);
                    })
            },
            searchTimeForDrop: function (sarch, cb) {
                var query = "select id,name,phone,from_add,to_add,from_time,to_time from pickdrop where to_time ILIKE '" + "%" + sarch + "%" + "';";
                sequelize.query(query,
                    {type: sequelize.QueryTypes.RAW})
                    .then(function (data) {
                        return cb(null, data[0]);
                        log.info('===>' + data[0]);
                    }, function (err) {
                        log.error('=>pickdrop Model ,Failed to process query overviewTrip function', err);
                        return cb(err);
                    })
            }
        }
    });
};


