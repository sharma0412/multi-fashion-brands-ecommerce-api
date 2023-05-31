var DataTypes = require("sequelize").DataTypes;
var _view_product = require("./view_product");

function initModels(sequelize) {
  var view_product = _view_product(sequelize, DataTypes);


  return {
    view_product,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
