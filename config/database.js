const Sequelize = require('sequelize');
const Models = require('../models');

module.exports =  new Sequelize('practice', 'suraj', 'srj@1998', {
    host: 'localhost',
    dialect: 'postgres'
});

Models.sequelize.sync({
    force : false,
   logging : console.log
}).then(function () {
   console.log('Nice! Database looks fine')
}).catch(function (err) {
   console.log(err, "Something went wrong with the Database Update!")
});
