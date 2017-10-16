import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import GoogleAuth from 'google-auth-library';
import requestify from 'requestify';

import User from '../models/User';
import contact from '../controllers/contact';

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).populate('_skills _interests').exec((err, user) => {
    done(err, user);
  });
});

const CONFLICT = 409;

exports.resetTokenLogin = (req, res) => {
  User.findOne({
    passwordResetToken: req.body.resetToken,
    passwordResetExpires: { $gte: Date.now() }
  })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: 'Password reset token is invalid or has expired.',
          token: null,
          status: 401,
        });
      }

      // user has authenticated correctly thus we create a JWT token
      return res.json({
        token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
        user,
        error: null,
        status: 200,
      });
    });
};

exports.apiLogin = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) { return next(err); }
    if (!user) {
      return res.status(401).json({
        error: 'Either email or password is incorrect',
        token: null,
        status: 401,
      });
    }
    // user has authenticated correctly thus we create a JWT token
    return res.json({
      token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
      user,
      error: null,
      status: 200,
    });
  })(req, res, next);
};

const handleLogin = (req, res, payload, mapPayloadToUser) =>
  (existingUser) => {
    if (existingUser) {
      res.json({
        token: jwt.sign({ email: existingUser.email }, process.env.SESSION_SECRET),
        user: existingUser,
        error: null,
        status: 200,
      });
    } else {
      User.findOne({ email: payload.email }).exec()
        .then((existingEmailUser) => {
          if (existingEmailUser) {
            return res.status(CONFLICT).json({
              error: 'There is already an account with this email address',
              status: CONFLICT,
            });
          }
          const newUser = new User(Object.assign({}, mapPayloadToUser(payload), {
            _skills: req.body._skills,
            _interests: req.body._interests,
            'profile.status': req.body['profile.status'],
          }));
          return newUser.save()
            .then(savedUser => contact.sendWelcomeEmail(savedUser, req.headers.host))
            .then(() => {
              newUser.populate('_skills _interests').execPopulate()
                .then(user => res.json({
                  token: jwt.sign({ email: user.email }, process.env.SESSION_SECRET),
                  user,
                  error: null,
                  status: 200,
                }));
            });
        })
        .catch(err => res.status(500).json({ error: err.message }));
    }
  };


exports.apiSignup = (req, res) => {
  const protocol = req.secure ? 'https://' : 'http://';
  const base_url = protocol + req.headers.host;
  handleLogin(req, res, req.body, payloadData => ({
    profile: {
      name: `${payloadData.firstName} ${payloadData.lastName}`,
      picture: `${base_url}/images/person_placeholder.gif`,
    },
    email: payloadData.email,
    password: payloadData.password,
  }))(null);
};

/**
 * DELETE /api/users
 * Delete user account.
 */
exports.deleteUser = (req, res) => {
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
    .then(data => res.json({ error: null, data }))
    .catch(err => res.status(500).json({ error: err }));
};

/**
 * POST /api/forgot
 * Send email to user account to reset password.
 */
exports.forgotPassword = (req, res) => {
  User.findOneAndUpdate({ email: req.body.forgotEmail.toLowerCase() },
    {
      passwordResetToken: crypto.randomBytes(16).toString('hex'),
      passwordResetExpires: Date.now() + 3600000 // 1 hour
    }, { new: true })
    .then(user => contact.forgotPasswordEmail(user, req.headers.host))
    .then(() => res.json({ error: null }))
    .catch(error => res.status(500).json({ error }));
};


exports.authenticate_google = (req, res) => {
  const auth = new GoogleAuth();
  const client = new auth.OAuth2(process.env.GOOGLE_ID, '', '');
  client.verifyIdToken(req.body.id_token, process.env.GOOGLE_ID, (e, login) => {
    const payload = login.getPayload();
    User.findOne({ google: payload.sub }).populate('_skills _interests').exec()
      .then(handleLogin(req, res, payload, payloadData => ({
        email: payloadData.email,
        google: payloadData.sub,
        'profile.name': payloadData.name,
        'profile.picture': payloadData.picture,
      })))
      .catch(error => res.status(500).json({ error }));
  });
};

const FB_ENDPOINT = 'https://graph.facebook.com/me';
exports.authenticate_facebook = (req, res) => {
  requestify.get(`${FB_ENDPOINT}`, {
    params: {
      fields: 'id,email,gender,location,hometown,name,picture',
      access_token: req.body.access_token,
    }
  })
    .then((response) => {
      const payload = response.getBody();
      User.findOne({ facebook: payload.id }).populate('_skills _interests').exec()
        .then(handleLogin(req, res, payload, payloadData => ({
          email: payloadData.email,
          facebook: payloadData.id,
          'profile.name': payload.name,
          'profile.gender': payload.gender,
          'profile.hometown': payload.hometown.name,
          'profile.location': payload.location.name,
          'profile.picture': payload.picture.data.url,
        })));
    })
    .catch(error => res.status(500).json({ error }));
};


/**
 * Sign in using Jwt token.
 */
passport.use(new JwtStrategy({ secretOrKey: process.env.SESSION_SECRET, jwtFromRequest: ExtractJwt.fromHeader('token') }, (jwt_payload, done) => {
  User.findOne({ email: jwt_payload.email }, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  });
}));


/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
  User.findOne({ email: email.toLowerCase() })
    .populate('_skills _interests')
    .exec()
    .then((user) => {
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }
      return user.comparePassword(password)
        .then((isMatch) => {
          if (isMatch) {
            return done(null, user);
          }
          return done(null, false, { msg: 'Invalid email or password' });
        });
    })
    .catch(err => console.log(err));
}));
