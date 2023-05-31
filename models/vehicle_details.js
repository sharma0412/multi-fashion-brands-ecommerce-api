const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehicle_details', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    driver_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    brand: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    model: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    number_plate: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ""
    },
    status: {
      type: DataTypes.ENUM('0','1'),
      allowNull: false,
      defaultValue: "1"
    },
    identification: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "",
      comment: "ex-addharcar"
    },
    driving_license: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    driving_no: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    expire_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    identification_no: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    identification_type: {
      type: DataTypes.STRING(255),
      allowNull: true
    } 
  }, {
    sequelize,
    tableName: 'vehicle_details',
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
