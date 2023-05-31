const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('order_items', {
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        productmeta: {
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
        product_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false,
            defaultValue: "1"
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_total: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        updated_ar: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        sequelize,
        tableName: 'order_items',
        timestamps: false
    });
};