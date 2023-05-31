const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    store_id: {
      type: DataTypes.CHAR(36),
      allowNull: true
    },
    account_type: {
      type: DataTypes.ENUM('0','1','2','3'),
      allowNull: false,
      defaultValue: "1",
      comment: "0 - super admin, 1-user , 2-driver, 3 -vendor"
    },
    signup_type: {
      type: DataTypes.ENUM('1','2','3','4'),
      allowNull: false,
      defaultValue: "1",
      comment: "1-normal, 2-facebook, 3-google,4-apple"
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ""
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    email: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: ""
    },
    password: {
      type: DataTypes.CHAR(255),
      allowNull: false,
      defaultValue: ""
    },
    profile_image: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: ""
    },
    device_type: {
      type: DataTypes.ENUM('iOS','Android',''),
      allowNull: false,
      defaultValue: ""
    },
    device_token: {
      type: DataTypes.CHAR(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('1','2'),
      allowNull: true,
      defaultValue: "1",
      comment: "2-deactive , 1-active"
    },
    online_status: {
      type: DataTypes.ENUM('1','2'),
      allowNull: false,
      defaultValue: "2",
      comment: "1-online, 2-offline"
    },
    latitude: {
      type: DataTypes.CHAR(20),
      allowNull: true
    },
    longitude: {
      type: DataTypes.CHAR(20),
      allowNull: true
    },
    remember_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    driver_identification_is: {
      type: DataTypes.ENUM('0','1','2'),
      allowNull: false,
      defaultValue: "0",
      comment: "0 - panding ,1-approve, 2-reject"
    }
  }, {
    sequelize,
    tableName: 'users',
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
