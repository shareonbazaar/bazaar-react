const User = require('../models/User');
const Skill = require('../models/Skill');
const Enums = require('../models/Enums');
const helpers = require('../utils/helpers');


function getPublicUserData (user) {
    return {
        name: user.profile.name,
        _id: user._id,
        picture: user.profile.picture,
        hometown: user.profile.hometown,
        location: user.profile.location,
        status: user.profile.status,
        gender: user.profile.gender,
        coins: user.coins,
        skills: user._skills,
        interests: user._interests,
        aboutMe: user.aboutMe,
        createdAt: user.createdAt,
        reviews: [],
    }
};

exports.apiGetUser = function (req, res) {
    console.log("API ")
    User.findById(req.params.id)
    .populate('_skills _interests')
    .exec((err, user) => {
        if (!user) {
            res.status(404).json(err);
        } else {
            res.json(getPublicUserData(user));
        }
    });
}

const EARTH_RADIUS_KM = 6378.1;
function performQuery (req, query, callback) {
  // Default match is an EXCHANGE match - that is, user is interested
  // in both receiving and providing the service.
  if (!(query.skills instanceof Array)) {
      callback({
        error: "'skills' parameter is required and must be an array of skills",
      });
      return;
  }

  var db_query = {
      _skills: {'$in': query.skills.map(helpers.toObjectId)},
      _interests: {'$in': query.skills.map(helpers.toObjectId)},
      _id: {'$ne': helpers.toObjectId(req.user._id)},
  };
  var error;

  if (query.request_type === Enums.RequestType.LEARN) {
      delete db_query['_interests'];
  } else if (query.request_type === Enums.RequestType.SHARE) {
      delete db_query['_skills'];
  }

  var distance = query.distance;
  var longitude = query.longitude;
  var latitude = query.latitude;

  // undefined will always get pushed to the end of the array, so this checks
  // that there is a defined value _and_ at least one undefined value.
  if ([distance, longitude, latitude].sort().indexOf(undefined) > 0) {
      error = {error: 'Distance, latitude, and longitude must all be specified together (or not at all).'};
      callback(error);
      return;
  }

  if (distance && longitude && latitude) {
      if (isNaN(distance) || distance <= 0) {
          error = {error: 'Distance must be a positive number'};
      }
      if (isNaN(longitude) || isNaN(latitude)) {
          error = {error: 'Latitude and longitude must be numbers'};
      }
      if (error) {
          callback(error);
          return;
      }
      db_query.loc = {
          '$geoWithin': {'$centerSphere': [ [Number(longitude), Number(latitude)], Number(distance) / EARTH_RADIUS_KM ] },
      }
  }
  User.find(db_query).populate('_skills _interests').exec(callback);
}

exports.apiSearchUsers = function (req, res) {
  if (Object.keys(req.query).length === 0) {
      User.find({_id: {'$ne': req.user.id}})
      .populate('_skills _interests')
      .exec((err, results) => {
          res.json(results.map(getPublicUserData));
      });
  } else {
      // FIXME: Use IP address to get long/lat?
      performQuery(req, req.query, (err, results) => {
          if (err) {
            res.status(400).json(err);
          } else {
            res.json(results.map(getPublicUserData));
          }
      });
  }
};
