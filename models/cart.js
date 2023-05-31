const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('cart', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        store_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        brand_id: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_meta: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_size: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        product_color: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'cart',
        timestamps: false
    });
};