const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('store_brand', {
        id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: "",
            primaryKey: true
        },
        brand_logo: {
            type: DataTypes.STRING(500),
            allowNull: true
        },
        brand_name: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        slot: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0
        },
        status: {
            type: DataTypes.ENUM('1', '2'),
            allowNull: false,
            defaultValue: "1",
            comment: "1-active,2-deactive"
        }
    }, {
        sequelize,
        tableName: 'store_brand',
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