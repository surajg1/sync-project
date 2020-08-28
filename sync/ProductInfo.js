const Models = require('../models');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const elasticsearchClient = require('../config/esConnection');
const { Op } = require('sequelize')
const moment = require('moment');
const CronJob = require('cron').CronJob

const _ = require('lodash');
class PIScheduler {
  constructor(syncType){
    this.syncType = syncType;
    this.ProductQueue = [];
    this.elasticQueue=[];
    this.index = 'productinfo';
    this.type = '_doc';
    this.product = [];
  }

  ProductQuery(){
  return new Promise((resolve, reject) =>{
    let condition = {};


    let DateForUpdate = moment(new Date()).utcOffset("+05:30").format('YYYY-MM-DD');
    console.log(DateForUpdate);

    if(this.syncType == 'inc'){
      condition = {
        where: {
          updatedAt: {
             [Op.gte]:  DateForUpdate
          }
        }
    }
    }

    Models.Product_info.findAll(condition).then((doc)=>{
       this.ProductQueue = doc;
       resolve(doc);
       // this.sync();
     }).catch(err => {
       reject(err);
       console.log(err);
     });
  });

}

  start(){


    this.ProductQuery().then((doc)=>{
      // console.log(doc);
      this.sync();
      this.setRedis();
    }).catch((err)=>{
      console.log(err);
    });
}

setRedis(){
  const TTL = 600;
  client.setex('ProductChache', TTL,JSON.stringify(this.ProductQueue));
}

getRedis(){
  return new Promise((resolve, reject)=>{
    client.get('ProductChache', (err, object)=>{
      if(err){
        reject(err);
        console.log(err);
      }
      resolve(object);
    })
  });
}

getElatics() {
    return new Promise((resolve, reject)=>{
      elasticsearchClient.search({
          index : 'productinfo',
          body:{
              "from": 0, "size" :10000,
              query:{
                  match_all: {}
              }
          }
      }).then( data => {
          var hits = data.hits.hits;
          resolve(hits);
      }, (error)=> {
          reject(error);
          console.error(error);
      }).catch(err => {
          res.send("Document is not found!");
      })
  })
}



sync() {
    _.map(this.ProductQueue, (p)=>{
        elasticsearchClient.index({
            index: this.index,
            type: this.type,
            id: p.id,
            body : {
              name: p.name,
              desc: p.desc,
              catid: p.catid,
              catname: p.catname,
              subcatid: p.subcatid,
              subcatname: p.subcatname,
              brandid: parseInt(p.brandid),
              brandname: p.brandname
            }
          }).then((response) => {
            var hits = response;
              console.log(response);
        }, (error) => {
            console.log(error.message)
        }).catch((err) => {
            console.log("Elasticsearch ERROR - data not fetched");
        })
      });
    }
}

new CronJob({
  cronTime: '* * 02 * * *',
  onTick: () => {
    console.log('start product sync');

        const productsync = new PIScheduler('full');
        productsync.start();

  },
}).start();

module.exports = PIScheduler;
