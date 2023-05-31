const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('stores', {
        id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: "",
            primaryKey: true
        },
        brand_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: ""
        },
        store_name: {
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: ""
        },
        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
        zipcode_id: {
            type: DataTypes.TINYINT,
            allowNull: false
        },
        latitude: {
            type: DataTypes.CHAR(20),
            allowNull: false,
            defaultValue: ""
        },
        longitude: {
            type: DataTypes.CHAR(20),
            allowNull: false,
            defaultValue: ""
        },
        seller_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
        seller_email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
        seller_contact: {
            type: DataTypes.STRING(255),
            allowNull: false,
            defaultValue: ""
        },
        surcharge: {
            type: DataTypes.FLOAT(8, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        service_fee: {
            type: DataTypes.FLOAT(8, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        packaging_fee: {
            type: DataTypes.FLOAT(8, 2),
            allowNull: false,
            defaultValue: 0.00
        },
        status: {
            type: DataTypes.ENUM('1', '2'),
            allowNull: false,
            defaultValue: "1",
            comment: "1-active ,2- deactive"
        }
    }, {
        sequelize,
        tableName: 'stores',
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