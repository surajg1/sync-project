const Models = require('../models');
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const client = redis.createClient(REDIS_PORT);
const elasticsearchClient = require('../config/esConnection');
const CronJob = require('cron').CronJob

const _ = require('lodash');
const moment = require('moment');
const { Op } = require('sequelize')


class MDScheduler {
  constructor(syncType){
    this.syncType = syncType;
    this.MDQueue = [];
    this.elasticQueue=[];
    this.index = 'mrpdiscount';
    this.type = '_doc';
    this.MD = []
  }

  MDQuery(){
  return new Promise((resolve) =>{
    let condition = {};
    if(this.syncType == 'inc'){
      condition = {
        where: {
          updatedAt: {
             [Op.gte]:  moment(new Date()).tz("asia/kolkata").format('YYYY-MM-DD HH:mm:ss')
          }
        }
    }
    }

    Models.Mrp_discount.findAll(condition).then((doc)=>{
      console.log(doc);
       this.MDQueue = doc;
       resolve(doc);
       // this.sync();
     }).catch(err => {
       console.log(err);
     });
  })

}

  start(){
    this.MDQuery().then((doc)=>{
      // console.log(doc);
      this.sync();
      this.setRedis();
    });

  }

setRedis(){
  const TTL = 600;
  client.setex('MDChaches', TTL,JSON.stringify(this.MDQueue));
}

getRedis(){
  return new Promise((resolve, reject)=>{
    client.get('MDChaches', (err, object)=>{
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
          index : 'mrpdiscount',
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
    _.map(this.MDQueue, (p)=>{
        elasticsearchClient.index({
            index: this.index,
            type: this.type,
            id: p.id,
            body : {
              mrp: p.mrp,
              discount: p.discount,
              ProductInfoId: p.ProductInfoId,
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
    console.log('start mrp sync');

        const mrpsync = new MDScheduler('full');
        mrpsync.start();

  },
}).start();

module.exports = MDScheduler;
