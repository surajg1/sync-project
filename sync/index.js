const Controller = require('./Controller');


module.exports = (app) => {
  app.post('/sync/setProduct/:type', Controller.setProduct);
  app.post('/sync/setmrpdiscount/:type', Controller.Mrp_discount);
  app.get('/getProducts', Controller.getProduct);
  app.get('/getMrpDiscount', Controller.getMrpDiscount);
  app.get('/getproductaggs', Controller.getProductAggs);
  app.get('/searchProduct/:search', Controller.serachProduct);
}
