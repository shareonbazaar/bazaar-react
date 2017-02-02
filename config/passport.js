const async = require('async');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GoogleAuth = require('google-auth-library');


const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).populate('_skills _interests').exec((err, user) => {
    done(err, user);
  });
});

const provideToken = (req, res, user, err) => {
    if (err || !user) {
      return res.status(401).json({
          error: 'Unauthorized access',
          error_details: err,
          token: null,
          status: 401,
      });
    }

    //user has authenticated correctly thus we create a JWT token
    var token = jwt.sign({ email: user.email }, process.env.SESSION_SECRET);
    res.json({
        token: token,
        user: user,
        error: null,
        status: 200,
    });
}

exports.apiLogin = (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({
          error: 'Unauthorized access',
          token: null,
          status: 401,
      });
    }
    //user has authenticated correctly thus we create a JWT token
    var token = jwt.sign({ email: user.email }, process.env.SESSION_SECRET);
    res.json({
        token: token,
        id: user.id,
        error: null,
        status: 200,
    });
  })(req, res, next);
};


function saveNewUser (req, res, user) {
    async.waterfall([
      function (callback) {
        user.save(function (err) {
          callback(err, user);
        });
      },
      function (user, callback) {
        // FIXME: add this
        // userController.sendWelcomeEmail(user, req, callback);
        callback(null)
      }
    ], function (err) {
        provideToken(req, res, user, err)
    });
}


exports.authenticate_google = (req, res, done) => {
  var auth = new GoogleAuth;
  var client = new auth.OAuth2(process.env.GOOGLE_ID, '', '');
  client.verifyIdToken(req.body.id_token, process.env.GOOGLE_ID, (e, login) => {
      var payload = login.getPayload();
      if (req.user) {
        User.findOne({ google: payload.sub }, (err, existingUser) => {
          if (existingUser) {
            req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
            done(err);
          } else {
            User.findById(req.user.id, (err, user) => {
              user.google = payload.sub;
              user.profile.name = payload.name;
              user.profile.picture = payload.picture;
              user.save((err) => {
                provideToken(req, res, user, err);
              });
            });
          }
        });
      } else {
        User.findOne({ google: payload.sub }, (err, existingUser) => {
          if (existingUser) {
            return provideToken(req, res, existingUser, err);
          }
          User.findOne({ email: payload.email }, (err, existingEmailUser) => {
            if (existingEmailUser) {
              provideToken(req, res, existingEmailUser, err);
            } else {
              const user = new User();
              user.email = payload.email;
              user.google = payload.sub;
              user.profile.name = payload.name;
              user.profile.picture = payload.picture;
              saveNewUser(req, res, user);
            }
          });
        });
      }
  });
}


/**
 * Sign in using Jwt token.
 */
passport.use(new JwtStrategy({secretOrKey: process.env.SESSION_SECRET, jwtFromRequest: ExtractJwt.fromHeader('token')}, (jwt_payload, done) => {
    User.findOne({email: jwt_payload.email}, (err, user) => {
        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() }, (err, user) => {
    if (!user) {
      return done(null, false, { msg: `Email ${email} not found.` });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (isMatch) {
        return done(null, user);
      }
      return done(null, false, { msg: 'Invalid email or password.' });
    });
  });
}));
