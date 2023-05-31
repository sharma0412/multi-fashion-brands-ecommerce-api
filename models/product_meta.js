const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('product_meta', {
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
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        color_name: {
            type: DataTypes.CHAR(100),
            allowNull: false,
            defaultValue: ""
        },
        color_code: {
            type: DataTypes.CHAR(20),
            allowNull: false,
            defaultValue: ""
        }
    }, {
        sequelize,
        tableName: 'product_meta',
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