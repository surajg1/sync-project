const elasticsearchClient = require('../config/esConnection');
const _ = require('lodash');
const Esindex = 'productinfo';
const Esdoc = '_doc';

exports.getCount = () => {
    return new Promise((resolve, reject)=>{
    elasticsearchClient.count({

      index: Esindex,
      type: '_doc'

    })
    .then(function(resp) {
      resolve(resp.count);
      // res.send(resp.count)
      console.log(resp.count);
    }, function(err) {
      reject(err);
      console.log(err.message);
    });
  });

}

exports.serachProduct = (key)=>{

  return new Promise((resolve, reject) =>{
    elasticsearchClient.search({
      index : Esindex,
      type: Esdoc,
      body:{
        "query": {
          "multi_match" : {
            "query" : key,
            "fields" : ["*"]
          }
        }
      }
    }).then( data => {
      var hits = data.hits.hits;
      resolve(hits);
      console.log(hits);
    }, (error)=> {
      reject(error);
      console.error(error);
    }).catch(err => {
      reject(err);
      console.log(err);
      console.log(err);
    });
  })
}


exports.getCatAggs = () => {
    elasticsearch.search({
        index: Esindex,
        body: {
            "aggs": {
                "avg_catogory": {
                    "avg": {
                        "field": "catname"
                    }
                }
            }
        }
    }).then((response) => {
        var hits = response
        console.log(hits);
    }, (error) => {
        console.trace(error.message)
    }).catch((err) => {
        console.log("Elasticsearch ERROR - data not fetched");
    })
}


exports.getStats = (key)=>{

  return new Promise((resolve, reject) =>{
    elasticsearchClient.search({
      index : Esindex,
      type: Esdoc,
      body: {
              "query" :{
              "match_all" :{}
            },
            "size":0,
             "aggs": {
                "catogary_stats": {
               "stats": {
                 "field": "catid"
               }
             },
             "subcatogory_stats": {
               "stats": {
                 "field": "subcatid"
               }
             },
             "brand_stats": {
               "stats": {
                 "field": "brandid"
               }
             }
            }
      }
    }).then( data => {
      var hits = data.hits.hits;
      resolve(data);
      console.log(data);
    }, (error)=> {
      reject(error);
      console.error(error);
    }).catch(err => {
      reject(err);
      console.log(err);
      console.log(err);
    });
  })
}
