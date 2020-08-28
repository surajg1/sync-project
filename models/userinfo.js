'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_info = sequelize.define('User_info', {
    email: { type: DataTypes.STRING, unique: 'compositeIndex'},
    mobileNumber : { type: DataTypes.STRING, unique: 'compositeIndex'},
    password: DataTypes.STRING
  }, {});
  return User_info;
};
