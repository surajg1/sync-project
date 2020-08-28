const PgDataInsert = require('./PgDataInsert');
const sync = require('./sync');
const UserData = require('./UserData');

module.exports = (app) => {
  // Insert routes below
  app.get('/', (req, res, next)=>{
    res.json({'message' :'Running'});
  });
  PgDataInsert(app);
  sync(app);
  UserData(app);

};
