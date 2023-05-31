const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('store_category', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        store_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: ""
        },
        brand_id: {
            type: DataTypes.CHAR(36),
            allowNull: true
        },
        name: {
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: ""
        },
        status: {
            type: DataTypes.ENUM('1', '2'),
            allowNull: false,
            defaultValue: "1",
            comment: "1-active-2-deactive"
        }
    }, {
        sequelize,
        tableName: 'store_category',
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