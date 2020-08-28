'use strict';
module.exports = (sequelize, DataTypes) => {
  const Mrp_discount = sequelize.define('Mrp_discount', {
    mrp: DataTypes.FLOAT,
    discount: DataTypes.DECIMAL
  }, {});
  Mrp_discount.associate = function(models) {
    Mrp_discount.belongsTo(models.Product_info);
  };
  return Mrp_discount;
};
