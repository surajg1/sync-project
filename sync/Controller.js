const PPScheduler = require('./ProductInfo');
const MDScheduler = require('./MrpDiscount');
const Aggregations = require('./aggregations');

exports.setProduct = (req, res, next) => {
      const products = new PPScheduler(req.params.type);
      products.start();
      res.send('syncing is Started');
}

exports.getProduct = (req, res, next) =>{
  const getproduct = new PPScheduler(req.params.type);
  getproduct.getRedis().then((data)=>{
    if(data !==null){
      res.send({"In redis":JSON.parse(data)});
    }else{
      getproduct.getElatics().then((data)=>{
        res.send({"In Elasticsearch":data});
      }).then((err)=>{
        res.send(err);
      });
    }
  }).catch((err)=>{
    res.send(err);
  });
}


exports.Mrp_discount = (req, res, next) =>{
  console.log(req.params.type);
  const mrpdiscount = new MDScheduler(req.params.type);
  mrpdiscount.start();
  res.send('syncing is Started');
}

exports.getMrpDiscount = (req, res, next) => {
  const mrpdiscount = new MDScheduler(req.params.type);

  mrpdiscount.getRedis().then((data)=>{
    if(data!==null){
      res.send({"In Redis":JSON.parse(data)});
    }else {
      mrpdiscount.getElatics().then((data)=>{
        res.send({"In Elasticsearch":data});
      }).then((err)=>{
        res.send(err);
      })
    }
  }).catch((err)=>{
    res.send(err);
  });
}

exports.getProductAggs = (req,res,next) => {

  const getproduct = new PPScheduler('full');


  Aggregations.getStats().then((doc)=>{
    getproduct.getElatics().then((data)=>{
      res.json({
        "Stats": doc,
        "Data": data
      });
    }).then((err)=>{
      res.send(err);
    })


  }).catch((err)=>{
    res.json({"Error":err});
  });
}

exports.serachProduct = (req, res, next) => {



  Aggregations.serachProduct(req.params.search).then((doc)=>{
    res.send(doc);
  }).catch((err)=>{
    console.log(err);
  });
}
