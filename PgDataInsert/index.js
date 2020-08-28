const PgController = require('./PgController');

module.exports = (app) => {
  app.get('/pgdatainsert', (req, res, next)=>{
    res.send('Insert data in postgresql');
  });

  app.post('/addprodut', PgController.addProdut);
  app.post('/addmrpdiscount', PgController.addMrpDiscount)
}
