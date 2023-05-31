const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('store_category_sections', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: ""
        },
        value: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            defaultValue: ""
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: true
        },
        store_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: ""
        },
        editable: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false,
            defaultValue: "1",
            comment: "0-No ,1- Yes"
        },
        status: {
            type: DataTypes.ENUM('1', '2'),
            allowNull: false,
            defaultValue: "1",
            comment: "1- Active , 2- deactive"
        }
    }, {
        sequelize,
        tableName: 'store_category_sections',
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