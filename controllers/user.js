const User = require('../models/User');
const Skill = require('../models/Skill');


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