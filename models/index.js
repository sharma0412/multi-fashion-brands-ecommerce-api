'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};
let sequelize;
let config = {};
if(process.env.APP_TYPE == "Production") {
  config = { "username": process.env.DB_PRO_USER, "password": process.env.DB_PRO_PASS, "database": process.env.DB_PRO_DATA, "host": process.env.DB_PRO_HOST, "dialect": process.env.DB_PRO_CONN };
} else {
  config = { "username": process.env.DB_DEV_USER, "password": process.env.DB_DEV_PASS, "database": process.env.DB_DEV_DATA, "host": process.env.DB_DEV_HOST, "dialect": process.env.DB_DEV_CONN };
}
sequelize = new Sequelize(config);


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
