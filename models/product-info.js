'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product_info = sequelize.define('Product_info', {
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    catid: DataTypes.INTEGER,
    catname: DataTypes.STRING,
    subcatid: DataTypes.INTEGER,
    subcatname: DataTypes.STRING,
    brandid: DataTypes.INTEGER,
    brandname: DataTypes.STRING
  }, {});
  Product_info.associate = function(models) {
    Product_info.hasOne(models.Mrp_discount)
  };
  return Product_info;
};
