// server.js
const express = require('express')
const path = require('path')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

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


var server = require('http').Server(app);
const passportConfig = require('./config/passport');

/**
 * Controllers (route handlers).
 */
const userController = require('./controllers/user');
const transactionController = require('./controllers/transaction');
const messageController = require('./controllers/message');


/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());


const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
app.use(upload.single('profilepic'));



// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, 'public')))

// Initialize the sockets for sending and receiving messages
messageController.initSockets(server);

app.get('/api/users/:id', passport.authenticate('jwt', { session: false }), userController.apiGetUser);
app.get('/api/users', passport.authenticate('jwt', { session: false }), userController.apiSearchUsers);
app.post('/api/users', passport.authenticate('jwt', { session: false }), userController.patchUser);
app.get('/api/transactions', passport.authenticate('jwt', { session: false }), transactionController.apiGetTransactions);
app.post('/api/transactions', passport.authenticate('jwt', { session: false }), transactionController.postTransaction);
app.patch('/api/transactions/:id', passport.authenticate('jwt', { session: false }), transactionController.patchTransaction);
app.post('/api/reviews', passport.authenticate('jwt', { session: false }), transactionController.postReview);


// ...
app.get('*', (req, res) => {
  // and drop 'public' in the middle of here
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/api/login', passportConfig.apiLogin);
app.post('/api/signup', passportConfig.apiSignup);

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
