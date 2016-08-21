
var Sequelize = require("sequelize"),
    log = require('app/utils/logger')(module),
    config = require('config').db;

if (!config) {
    log.error('Please provide database configurations in config.pg.');
    process.exit(1);
}
log.info('=>Database configuration - ', config);
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    define: {
        timestamps: false // true by default
    },
    pool: {
        max: config.maxPoolSize,
        min: config.minPoolSize,
        idle: config.idleConnectionTimeout
    }
});

var models = {
    Signup: sequelize.import(__dirname + '/signup'),
    Pickdrop :sequelize.import(__dirname+'/pickdrop')
};

module.exports = models;
// export connection
module.exports.sequelize = sequelize;

