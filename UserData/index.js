const Controller = require('./Controller');


module.exports = (app) => {
  app.post('/userdata/encreption', Controller.UserEncreprion);
  app.post('/userdata/decreption', Controller.UserDecreption);

}
