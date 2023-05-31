const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('delivery_fee', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        '0-10': {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        '10-25': {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        '25-50': {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        '50+': {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false,
            defaultValue: "1"
        }
    }, {
        sequelize,
        tableName: 'delivery_fee',
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