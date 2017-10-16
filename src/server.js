// server.js
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import passport from 'passport';
import bodyParser from 'body-parser';
import multer from 'multer';

import { check, validationResult } from 'express-validator/check';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import webpackconfig from '../config/webpack.dev-config';
import passportConfig from './controllers/passport';

/**
 * Controllers (route handlers).
 */
import userController from './controllers/user';
import transactionController from './controllers/transaction';
import messageController from './controllers/message';
import skillController from './controllers/skill';
import contactController from './controllers/contact';

// Use native promises
mongoose.Promise = global.Promise;


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env' });


/**
 * Create Express server.
 */
const app = express();
module.exports = app;


const server = require('http').Server(app);


/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
});
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());


const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use(upload.single('profilepic'));

if (app.get('env') === 'development') {
  new WebpackDevServer(webpack(webpackconfig), {
    publicPath: webpackconfig.output.publicPath,
    path: webpackconfig.output.path,
    hot: true,
    historyApiFallback: true,
    proxy: {
      '*': 'http://localhost:3000',
    }
  }).listen(8080, 'localhost', (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('WebpackDevServer listening on port 8080. Open browser at:');
    console.log('http://localhost:8080');
  });
}

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, '../public')));

// Initialize the sockets for sending and receiving messages
messageController.initSockets(server);


const UNPROCESSABLE_ENTITY = 422;
const verify = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(UNPROCESSABLE_ENTITY).json({ errors: errors.mapped() });
  }
  next();
};

app.get('/api/users/:id', passport.authenticate('jwt', { session: false }), userController.apiGetUser);
app.get('/api/users', passport.authenticate('jwt', { session: false }), userController.apiSearchUsers);
app.post('/api/users', passport.authenticate('jwt', { session: false }), userController.patchUser);
app.delete('/api/users', passport.authenticate('jwt', { session: false }), passportConfig.deleteUser);
app.get('/api/surprise', passport.authenticate('jwt', { session: false }), userController.surprise);
app.get('/api/transactions', passport.authenticate('jwt', { session: false }), transactionController.apiGetTransactions);
app.post('/api/transactions', passport.authenticate('jwt', { session: false }), transactionController.postTransaction);
app.post('/api/confirmTransaction', passport.authenticate('jwt', { session: false }), transactionController.confirmTransaction);
app.post('/api/reviews', passport.authenticate('jwt', { session: false }), transactionController.postReview);
app.get('/api/categories', skillController.apiGetCategories);

const validateContact = [
  check('name').exists(),
  check('email').isEmail(),
  check('message').exists(),
];

app.post('/api/contact', validateContact, verify, contactController.postContact);

// ...
app.get('*', (req, res) => {
  // and drop 'public' in the middle of here
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

const validateUser = [
  check('firstName').exists(),
  check('lastName').exists(),
  check('email').isEmail(),
  check('password').exists(),
];


app.post('/api/login', passportConfig.apiLogin);
app.post('/api/signup', validateUser, verify, passportConfig.apiSignup);
app.post('/api/forgot', passportConfig.forgotPassword);
app.post('/api/resetPassword', passportConfig.resetTokenLogin);

/**
 * OAuth authentication routes. (Sign in)
 */
app.post('/auth/google', passportConfig.authenticate_google);
app.post('/auth/facebook', passportConfig.authenticate_facebook);


/**
 * Start Express server.
 */
server.listen(app.get('port'), () => {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});
