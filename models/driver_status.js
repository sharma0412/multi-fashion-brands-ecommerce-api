const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('driver_status', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        online: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false
        },
        offline: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false
        },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'driver_status',
        timestamps: false,
        indexes: [{
            name: "PRIMARY",
            unique: true,
            using: "BTREE",
            fields: [
                { name: "id" },
            ]
        }, ]
    });
};