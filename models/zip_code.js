const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('zip_code', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        city: {
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: ""
        },
        state: {
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: ""
        },
        zipcode: {
            type: DataTypes.CHAR(10),
            allowNull: false,
            defaultValue: ""
        },
        country: {
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: ""
        },
        status: {
            type: DataTypes.ENUM('1', '2'),
            allowNull: false,
            defaultValue: "1",
            comment: "1- active, 2- deactive"
        }
    }, {
        sequelize,
        tableName: 'zip_code',
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