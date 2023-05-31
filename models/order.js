const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('order', {
        id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        delivery_address: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        card_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        payment_mode: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        transaction_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        delivery_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        delivery_fee: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        service_fee: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subcharge_fee: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        item_total: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        grand_total: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        discount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('0', '1'),
            allowNull: false,
            defaultValue: "1"
        },
        packaging: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        store_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        cancel_reason: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        sequelize,
        tableName: 'order',
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