const Transaction = require('../models/Transaction');
const Review = require('../models/Review');
const Enums = require('../models/Enums');
const helpers = require('../utils/helpers');

/**
 * GET /transactions
 * Show transactions for current user
 */
exports.apiGetTransactions = (req, res) => {

    Transaction.aggregate([
        {
            '$match': {
                '_participants': helpers.toObjectId(req.user._id),
                'status': {
                    '$in': [Enums.StatusType.PROPOSED,
                            Enums.StatusType.ACCEPTED,
                            Enums.StatusType.RECIPIENT_ACK,
                            Enums.StatusType.SENDER_ACK,
                            Enums.StatusType.COMPLETE]
                    }
            }
        },
        {
            '$lookup': {
                'from': 'messages',
                'localField': '_id',
                'foreignField': '_transaction',
                'as': '_messages',
            }
        },
        {
            '$unwind': {path: '$_messages', preserveNullAndEmptyArrays: true}
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': '_messages._sender',
                'foreignField': '_id',
                'as': '_messages._sender',
            }
        },
        {
            '$unwind': {path: '$_messages._sender', preserveNullAndEmptyArrays: true}
        },
        {
            '$group': {
                '_id': '$_id',
                'service': {'$first': '$service'},
                '_creator': {'$first': '$_creator'},
                '_messages': {'$push': '$_messages'},
                'loc': {'$first': { '$ifNull': [ "$loc", {'$literal': {type: 'Point', coordinates: [null, null]}}] }},
                'status': {'$first': '$status'},
                'happenedAt': {'$first': '$happenedAt'},
                'placeName': {'$first': '$placeName'},
                'request_type': {'$first': '$request_type'},
                '_participants': {'$first': '$_participants'},
                'createdAt': {'$first': '$createdAt'}
            }
        },
        // This $project is needed to remove empty objects from _messages array
        // that were put there via the lookup to for _sender
        {
            '$project': {
                '_messages': { '$setDifference': [ '$_messages', [{}] ] },
                'service': 1,
                '_creator': 1,
                'loc': 1,
                'status': 1,
                'happenedAt': 1,
                'placeName': 1,
                'request_type': 1,
                '_participants': 1,
                'createdAt': 1,
            }
        },
        {
            '$lookup': {
                'from': 'reviews',
                'localField': '_id',
                'foreignField': '_transaction',
                'as': '_reviews',
            }
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': '_creator',
                'foreignField': '_id',
                'as': '_creator',
            }
        },
        {
            "$unwind": "$_creator",
        },
        {
            '$lookup': {
                'from': 'skills',
                'localField': 'service',
                'foreignField': '_id',
                'as': 'service',
            }
        },
        {
            "$unwind": "$service",
        },
        {
            '$unwind': '$_participants',
        },
        {
            '$lookup': {
                'from': 'users',
                'localField': '_participants',
                'foreignField': '_id',
                'as': '_participants',
            }
        },
        {
            '$unwind': '$_participants',
        },
        {
            '$group': {
                '_id': '$_id',
                'service': {'$first': '$service'},
                '_creator': {'$first': '$_creator'},
                '_messages': {'$first': '$_messages'},
                '_reviews': {'$first': '$_reviews'},
                'loc': {'$first': { '$ifNull': [ "$loc", {'$literal': {type: 'Point', coordinates: [null, null]}}] }},
                'status': {'$first': '$status'},
                'happenedAt': {'$first': '$happenedAt'},
                'placeName': {'$first': '$placeName'},
                'request_type': {'$first': '$request_type'},
                '_participants': {'$push': '$_participants'},
                'createdAt': {'$first': '$createdAt'}
            }
        },
        {
            '$sort': {
                'createdAt': -1,
            }
        },
    ])
    .exec()
    .then(transactions => res.json(transactions))
    .catch(err => res.status(500).json(err));
};

/**
 * POST /transactions
 * Add a transaction for current user. This is the initial
 * request so status is PROPOSED.
 */
exports.patchTransaction = (req, res) => {
    // FIXME: May need more authentication checks here
    Transaction.findOneAndUpdate(
      {
        _id: req.params.id,
        _participants: req.user.id
      },
      req.body)
    .then((data) => res.json({error: null, data}))
    .catch((err) => res.status(500).json({error: err}));
};


/**
 * POST /transactions
 * Add a transaction for current user. This is the initial
 * request so status is PROPOSED.
 */
exports.postTransaction = (req, res) => {
    var trans = new Transaction({
        service: req.body.service,
        request_type: req.body.request_type,
        _participants: [req.body.recipient, req.body.sender],
        amount: 1,
        _creator: req.body.sender,
        status: Enums.StatusType.PROPOSED,
    });
    console.log(trans)
    trans.save()
    .then((data) => res.json({error: null, data}))
    .catch((err) => res.status(500).json({error: err}));
};

/**
 * POST /reviews
 * Add a review for a transaction
 */
exports.postReview = (req, res) => {
    // FIXME: Add subject?
    var review = new Review({
        timeSent: new Date(),
        text: req.body.text,
        rating: req.body.rating,
        _transaction: req.body.t_id,
        _creator: req.user.id,
    });

    review.save()
    .then((data) => res.json({error: null, data}))
    .catch((err) => res.status(500).json({error: err}));
};
