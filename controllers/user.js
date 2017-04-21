const aws = require('aws-sdk');

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
    User.findById(req.params.id)
    .populate('_skills _interests')
    .exec()
    .then((user) => {
        if (!user) {
            res.status(404).json(err);
        } else {
            res.json(getPublicUserData(user));
        }
    }).catch((err) => {
        res.status(500).json(err);
    });
}

const EARTH_RADIUS_KM = 6378.1;
function performQuery (req, query) {
  // Default match is an EXCHANGE match - that is, user is interested
  // in both receiving and providing the service.
  if (!(query.skills instanceof Array)) {
    return Promise.reject(new Error("'skills' parameter is required and must be an array of skills"));
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
      return Promise.reject(new Error('Distance, latitude, and longitude must all be specified together (or not at all).'));
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
  return User.find(db_query).populate('_skills _interests').exec();
}

exports.apiSearchUsers = (req, res) => {
  if (Object.keys(req.query).length === 0) {
      User.find({_id: {'$ne': req.user.id}})
      .populate('_skills _interests')
      .exec()
      .then(results => res.json(results.map(getPublicUserData)))
      .catch(err => res.status(500).json(err));
  } else {
      // FIXME: Use IP address to get long/lat?
      performQuery(req, req.query)
      .then(results => res.json(results.map(getPublicUserData)))
      .catch(err => res.status(500).json(err));
  }
};

function uploadPicture (filename, fileBuffer, mimetype, callback) {
    //aws credentials
    aws.config = new aws.Config();
    aws.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    aws.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    aws.config.region = process.env.AWS_REGION;
    var BUCKET_NAME = process.env.AWS_BUCKET_NAME;

    var s3 = new aws.S3();
    return s3.putObject({
        ACL: 'public-read',
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: fileBuffer,
        ContentType: mimetype
    }).promise();
}

exports.patchUser = (req, res) => {
    var prevPromise = new Promise((resolve) => resolve({}));
    if (req.body.bookmarks === '') req.body.bookmarks = [];
    if (req.body._skills === '') req.body._skills = [];
    if (req.body._interests === '') req.body._interests = [];
    if (req.file) {
        var mimetype = req.file.mimetype;
        var filename = req.user._id + '.' + mimetype.split('/').pop();
        var picUrl = `https://s3.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_BUCKET_NAME}/${filename}`;
        prevPromise = uploadPicture(filename, req.file.buffer, mimetype)
                      .then(() => {return {'profile.picture': picUrl}})
    }

    prevPromise
    .then((pic) => {
        return User.findOneAndUpdate(
          {_id: req.user.id},
          Object.assign({}, req.body, pic),
          {new: true})
          .populate('_skills _interests')
          .exec();
    })
    .then((data) => res.json({error: null, data}))
    .catch((err) => {console.log(err);res.status(500).json({error: err})});
};
