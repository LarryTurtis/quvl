import express from 'express';
import helmet from 'helmet';
import nconf from 'nconf';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import autoIncrement from 'mongoose-auto-increment';
import mongoose from 'mongoose';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from '../../webpack.config';
import bootstrap from './bootstrap';
import configureWatcher from './watcher';
import configDB from './config/database';
// configuration ===============================================================
const connection = mongoose.connect(configDB.url); // connect to our database
autoIncrement.initialize(connection);

const app = express();

if (nconf.get('NODE_ENV') === 'development') {
  const compiler = webpack(config);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
  configureWatcher(compiler);
}

app.enable('trust proxy');
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser('m00k13bL@yLoc')); // read cookies (needed for auth)
app.use(bodyParser({ limit: '50mb' }));
app.use(bodyParser.json());

// Set CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.send(200);
  }
  else {
    next();
  }
});

app.use(express.static(config.output.publicPath));

// required for passport
app.use(session({ secret: 'm00k13bL@yLoc' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

require('./config/passport')(passport); // pass passport for configuration
require('./app/routes/authentication-routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
// If no other routes match, launch the client instead.
app.use(bootstrap);

export default app;
