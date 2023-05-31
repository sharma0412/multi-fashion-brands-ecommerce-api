const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product_meta_value', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: ""
    },
    product_meta_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    size: {
      type: DataTypes.CHAR(20),
      allowNull: false,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('1','2'),
      allowNull: false,
      defaultValue: "1",
      comment: "1-active , 2- deactive"
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    price: {
      type: DataTypes.FLOAT(8,2),
      allowNull: false,
      defaultValue: 0.00
    }
  }, {
    sequelize,
    tableName: 'product_meta_value',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
