const elasticsearch = require('elasticsearch');

// const config = require("../config.json");

const elasticClient = new elasticsearch.Client({
    host :'http://localhost:9200/'
});

module.exports = elasticClient;
