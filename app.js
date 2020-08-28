require('./config/database');

const routes = require('./routes');
const restify = require('restify');
const app = restify.createServer();
app.use(restify.plugins.bodyParser());

routes(app);

app.listen(3000, ()=>{
  console.log("Server Started....");
});
