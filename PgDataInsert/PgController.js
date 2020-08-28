const Models = require('../models');

exports.addProdut = (req, res, next) => {
  const product = {
    name: req.body.name,
    desc: req.body.desc,
    catid: req.body.catid,
    catname: req.body.catname,
    subcatid: req.body.subcatid,
    subcatname: req.body.subcatname,
    brandid: req.body.brandid,
    brandname: req.body.brandname
  }
    try{
    Models.Product_info.create(product).then((doc)=>{
      res.send('Created');
    }).catch((err)=>{
      res.send(err);
    });
  }catch(err){
    res.send(err);
  }
}

exports.addMrpDiscount = (req, res, next)=>{
  const mrpdiscount = {
    mrp: req.body.mrp,
    discount: req.body.discount,
    ProductInfoId: req.body.ProductInfoId
  }

  try{
    Models.Mrp_discount.create(mrpdiscount).then((doc)=>{
      res.send({"Created":doc});
    }).catch((error)=>{
      res.send(error);
    })
  }catch(err){
    res.send(err);
  }
}
