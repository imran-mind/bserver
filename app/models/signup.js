/**
 * @author: Imran Shaikh
 * @email: shaikhimran115@gmail.com
 */


module.exports = function (sequelize, DataTypes) {
    return sequelize.define('signup', {
        id: {
            type: DataTypes.TEXT,
            field: 'id',
            primaryKey: true
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
        createdAt: {
            type: DataTypes.BIGINT,
            field: 'created_at'
        },
        updatedAt: {
            type: DataTypes.BIGINT,
            field: 'updated_at'
        }
    }, {
        freezeTableName: true
    });
};


