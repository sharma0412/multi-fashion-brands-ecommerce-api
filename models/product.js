const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('product', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        parent_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: ""
        },
        name: {
            type: DataTypes.CHAR(255),
            allowNull: false,
            defaultValue: ""
        },
        description: {
            type: DataTypes.STRING(1000),
            allowNull: false,
            defaultValue: ""
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        store_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: ""
        },
        brand_id: {
            type: DataTypes.CHAR(36),
            allowNull: false,
            defaultValue: ""
        },
        status: {
            type: DataTypes.ENUM('1', '2'),
            allowNull: false,
            defaultValue: "1",
            comment: "1-active , 2-deactive"
        }
    }, {
        sequelize,
        tableName: 'product',
        timestamps: false
    });
};