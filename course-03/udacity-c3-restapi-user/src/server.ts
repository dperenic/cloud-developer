import express from 'express';
import { sequelize } from './sequelize';

import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import { config } from './config/config';
import { V0MODELS } from './controllers/v0/model.index';

const c = config.dev;

(async () => {
  await sequelize.addModels(V0MODELS);
  await sequelize.sync();

  const app = express();

  var cors = require('cors')
  app.use(cors());
  app.use(cors({credentials: true, origin: true}));
  app.options('*', cors({credentials: true, origin: true}));

  const port = process.env.PORT || 8080; // default port to listen
  
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    // res.header("Access-Control-Allow-Origin", c.url);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET'); //to give access to all the methods provided
      return res.status(200).json({});
    }
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v0/" );
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running ` + c.url );
      console.log( `press CTRL+C to stop server` );
  } );
})();