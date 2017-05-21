const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const GoogleAuth = require('google-auth-library');
const requestify = require('requestify');

const User = require('../models/User');
const contact = require('../controllers/contact');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).populate('_skills _interests').exec((err, user) => {
    done(err, user);
  });
});

const CONFLICT = 409;

exports.resetTokenLogin = (req, res, next) => {
    User.findOne({
        passwordResetToken: req.body.resetToken,
        passwordResetExpires: { '$gte': Date.now() }
    })
    .then(user => {
        if (!user) {
            return res.status(401).json({
                error: 'Password reset token is invalid or has expired.',
                token: null,
                status: 401,
            })
        }

        //user has authenticated correctly thus we create a JWT token
        res.json({
            token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
            user: user,
            error: null,
            status: 200,
        });
    })
};

exports.apiLogin = (req, res, next) => {
  passport.authenticate('local', {session: false}, (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({
          error: 'Either email or password is incorrect',
          token: null,
          status: 401,
      });
    }
    //user has authenticated correctly thus we create a JWT token
    res.json({
        token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
        user: user,
        error: null,
        status: 200,
    });
  })(req, res, next);
};


exports.apiSignup = (req, res, next) => {
  req.assert('firstName', 'You need to provide a first name').notEmpty();
  req.assert('lastName', 'You need to provide a last name').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').notEmpty().len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
  req.sanitize('email').normalizeEmail({ remove_dots: false });

  const errors = req.validationErrors();
  if (errors) {
      return res.status(400).json({
          error: errors.map(e => e.msg),
          token: null,
          status: 400,
      });
  }

  var protocol = req.secure ? 'https://' : 'http://';
  var base_url = protocol + req.headers.host;
  User.findOne({ email: req.body.email }).exec()
  .then(existingUser => {
      if (existingUser) {
          res.status(CONFLICT).json({
              error: "There is already an account with this email address",
              status: CONFLICT,
          });
      } else {
          const user = new User({
              profile: {
                name: req.body.firstName + ' ' + req.body.lastName,
                picture: base_url + '/images/person_placeholder.gif',
              },
              email: req.body.email,
              password: req.body.password,
          });
          user.save()
          .then(user => contact.sendWelcomeEmail(user, req.headers.host))
          .then(data => res.json({
              token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
              user: user,
              error: null,
              status: 200,
          }))
      }
  })
  .catch(err => res.status(500).json({error: err}));
};

/**
 * DELETE /api/users
 * Delete user account.
 */
exports.deleteUser = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.user._id },
    {
      isDeleted: true,
      // make sure email is still unique but free up the real email in case user wants to sign up again
      email: req.user.id,
      'profile.name': 'Deleted User',
      'profile.picture': '/images/person_placeholder.gif',
      facebook: '',
      google: '',
    }
  )
  .then((data) => res.json({error: null, data}))
  .catch((err) => res.status(500).json({error: err}));
};

/**
 * POST /api/forgot
 * Send email to user account to reset password.
 */
exports.forgotPassword = (req, res, next) => {
  User.findOneAndUpdate({ email: req.body.forgotEmail.toLowerCase() },
  {
      passwordResetToken: crypto.randomBytes(16).toString('hex'),
      passwordResetExpires: Date.now() + 3600000 // 1 hour
  }, {new: true})
  .then(user => contact.forgotPasswordEmail(user, req.headers.host))
  .then(user => res.json({error: null}))
  .catch(err => res.status(500).json({error: err}));
};

exports.authenticate_google = (req, res, done) => {
  var auth = new GoogleAuth;
  var client = new auth.OAuth2(process.env.GOOGLE_ID, '', '');
  client.verifyIdToken(req.body.id_token, process.env.GOOGLE_ID, (e, login) => {
      var payload = login.getPayload();
      User.findOne({ google: payload.sub }).populate('_skills _interests').exec()
      .then(existingUser => {
        if (existingUser) {
            res.json({
                token: jwt.sign({ email: existingUser.email }, process.env.SESSION_SECRET),
                user: existingUser,
                error: null,
                status: 200,
            });
        } else {
            User.findOne({ email: payload.email }).exec()
            .then(existingEmailUser => {
                if (existingEmailUser) {
                    res.status(CONFLICT).json({
                        error: "There is already an account with this email address",
                        status: CONFLICT,
                    });
                } else {
                    const user = new User({
                        email: payload.email,
                        google: payload.sub,
                        'profile.name': payload.name,
                        'profile.picture': payload.picture,
                    });
                    user.save()
                    .then(user => contact.sendWelcomeEmail(user, req.headers.host))
                    .then(data => res.json({
                        token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
                        user: user,
                        error: null,
                        status: 200,
                    }))
                }
            });
          }
      })
      .catch(err => res.status(500).json({error: err}));
  });
}

const FB_ENDPOINT = 'https://graph.facebook.com/me';
exports.authenticate_facebook = (req, res, done) => {
    requestify.get(`${FB_ENDPOINT}`, {
        params: {
            fields: 'id,email,gender,location,hometown,name,picture',
            access_token: req.body.access_token,
        }
    })
    .then((response) => {
        var payload = response.getBody();
        User.findOne({ facebook: payload.id }).populate('_skills _interests').exec()
        .then(existingUser => {
            if (existingUser) {
                //user has authenticated correctly thus we create a JWT token
                res.json({
                    token: jwt.sign({ email: existingUser.email }, process.env.SESSION_SECRET),
                    user: existingUser,
                    error: null,
                    status: 200,
                });
            } else {
                User.findOne({ email: payload.email }).exec()
                .then(existingEmailUser => {
                    if (existingEmailUser) {
                        res.status(CONFLICT).json({
                            error: "There is already an account with this email address",
                            status: CONFLICT,
                        });
                    } else {
                        const user = new User({
                            email: payload.email,
                            facebook: payload.id,
                            'profile.name': payload.name,
                            'profile.gender': payload.gender,
                            'profile.hometown': payload.hometown.name,
                            'profile.location': payload.location.name,
                            'profile.picture': payload.picture.data.url,
                        });
                        user.save()
                        .then(user => contact.sendWelcomeEmail(user, req.headers.host))
                        .then(data => res.json({
                            token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
                            user: user,
                            error: null,
                            status: 200,
                        }))
                    }
                })
            }
        })
    })
    .catch(err => res.status(500).json({error: err}));
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
    User.findOne({ email: email.toLowerCase() })
    .populate('_skills _interests')
    .exec()
    .then(user => {
        if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
        }
        user.comparePassword(password)
        .then(isMatch => {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {msg: 'Invalid email or password'})
            }
        });
    });
}));
