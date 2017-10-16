import Transaction from '../models/Transaction';
import Review from '../models/Review';
import User from '../models/User';
import Enums from '../models/Enums';
import helpers from '../utils/helpers';

import messageController from '../controllers/message';
import contact from '../controllers/contact';

/**
 * GET /transactions
 * Show transactions for current user
 */
exports.apiGetTransactions = (req, res) => {
  Transaction.aggregate([
    {
      $match: {
        _participants: helpers.toObjectId(req.user._id),
        status: {
          $in: [Enums.StatusType.PROPOSED,
            Enums.StatusType.ACCEPTED,
            Enums.StatusType.COMPLETE]
        }
      }
    },
    {
      $lookup: {
        from: 'messages',
        localField: '_id',
        foreignField: '_transaction',
        as: '_messages',
      }
    },
    {
      $unwind: { path: '$_messages', preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_messages._sender',
        foreignField: '_id',
        as: '_messages._sender',
      }
    },
    {
      $unwind: { path: '$_messages._sender', preserveNullAndEmptyArrays: true }
    },
    {
      $group: {
        _id: '$_id',
        service: { $first: '$service' },
        _creator: { $first: '$_creator' },
        _messages: { $push: '$_messages' },
        loc: { $first: { $ifNull: ['$loc', { $literal: { type: 'Point', coordinates: [null, null] } }] } },
        status: { $first: '$status' },
        happenedAt: { $first: '$happenedAt' },
        placeName: { $first: '$placeName' },
        request_type: { $first: '$request_type' },
        _participants: { $first: '$_participants' },
        _confirmations: { $first: '$_confirmations' },
        createdAt: { $first: '$createdAt' }
      }
    },
    // This $project is needed to remove empty objects from _messages array
    // that were put there via the lookup to for _sender
    {
      $project: {
        _messages: { $setDifference: ['$_messages', [{}]] },
        service: 1,
        _creator: 1,
        loc: 1,
        status: 1,
        happenedAt: 1,
        placeName: 1,
        request_type: 1,
        _participants: { $setDifference: ['$_participants', [helpers.toObjectId(req.user._id)]] },
        _confirmations: 1,
        createdAt: 1,
      }
    },
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: '_transaction',
        as: '_reviews',
      }
    },
    {
      $unwind: { path: '$_reviews', preserveNullAndEmptyArrays: true }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_reviews._creator',
        foreignField: '_id',
        as: '_reviews._creator',
      }
    },
    {
      $unwind: { path: '$_reviews._creator', preserveNullAndEmptyArrays: true }
    },
    {
      $group: {
        _id: '$_id',
        service: { $first: '$service' },
        _creator: { $first: '$_creator' },
        _messages: { $first: '$_messages' },
        loc: { $first: { $ifNull: ['$loc', { $literal: { type: 'Point', coordinates: [null, null] } }] } },
        status: { $first: '$status' },
        happenedAt: { $first: '$happenedAt' },
        placeName: { $first: '$placeName' },
        request_type: { $first: '$request_type' },
        _confirmations: { $first: '$_confirmations' },
        _participants: { $first: '$_participants' },
        createdAt: { $first: '$createdAt' },
        _reviews: { $push: '$_reviews' },
      }
    },
    {
      $project: {
        _reviews: { $setDifference: ['$_reviews', [{}]] },
        service: 1,
        _creator: 1,
        loc: 1,
        status: 1,
        happenedAt: 1,
        placeName: 1,
        request_type: 1,
        _participants: 1,
        _confirmations: 1,
        _messages: 1,
        createdAt: 1,
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_creator',
        foreignField: '_id',
        as: '_creator',
      }
    },
    {
      $unwind: '$_creator',
    },
    {
      $lookup: {
        from: 'skills',
        localField: 'service',
        foreignField: '_id',
        as: 'service',
      }
    },
    {
      $unwind: '$service',
    },
    {
      $unwind: '$_participants',
    },
    {
      $lookup: {
        from: 'users',
        localField: '_participants',
        foreignField: '_id',
        as: '_participants',
      }
    },
    {
      $unwind: '$_participants',
    },
    {
      $group: {
        _id: '$_id',
        service: { $first: '$service' },
        _creator: { $first: '$_creator' },
        _messages: { $first: '$_messages' },
        _reviews: { $first: '$_reviews' },
        loc: { $first: { $ifNull: ['$loc', { $literal: { type: 'Point', coordinates: [null, null] } }] } },
        status: { $first: '$status' },
        happenedAt: { $first: '$happenedAt' },
        placeName: { $first: '$placeName' },
        request_type: { $first: '$request_type' },
        _confirmations: { $first: '$_confirmations' },
        _participants: { $push: '$_participants' },
        createdAt: { $first: '$createdAt' }
      }
    },
    {
      $sort: {
        createdAt: -1,
      }
    },
  ])
    .exec()
    .then(transactions => res.json(transactions))
    .catch(err => res.status(500).json(err));
};

exports.confirmTransaction = (req, res) => {
  Transaction.update({ _id: req.body.t_id },
    {
      $addToSet: { _confirmations: req.user.id },
    }
  )
    .then(() => res.json({ error: null }))
    .catch(err => res.json({ error: err.message }));
};

/**
 * POST /transactions
 * Add a transaction for current user. This is the initial
 * request so status is PROPOSED.
 */
exports.postTransaction = (req, res) => {
  const emailPartners = (t, func, acceptsEmailFilter) =>
    Promise.all(
      t._participants
        .filter(u_id => u_id.toString() !== req.user.id.toString())
        .map(u_id =>
          User.findOneAndUpdate({ _id: u_id }, {
            $addToSet: { unreadTransactions: t._id }
          }, { new: true })
            .then((u) => {
              if (u.acceptsEmails[acceptsEmailFilter]) {
                return func(req.user, u, t, req.headers.host);
              }
              return null;
            })
        )
    );
  // FIXME: May need more authentication checks here
  let promise;
  // If there is a transaction ID, we are updating an existing
  // transaction. Otherwise, create a new one.
  if (req.body.t_id) {
    promise = Transaction
      .findOneAndUpdate({
        _id: req.body.t_id,
        _participants: req.user.id
      }, req.body.transaction, { new: true })
      .then((t) => {
        // If either location or time changed, send update email to user
        if (req.body.transaction.happenedAt || req.body.transaction.loc) {
          return emailPartners(t, contact.sendUpdateEmail, 'updateExchanges')
            .then(() => t);
        }
        return t;
      });
  } else {
    const trans = new Transaction(req.body.transaction);
    promise = trans
      .save()
      // Send email to user about new exchange
      .then(t =>
        emailPartners(t, contact.sendNewTransactionEmail, 'newExchanges')
          .then(() => t)
      );
  }

  // If there is a message along with the transaction, add it to database
  promise.then((t) => {
    if (req.body.message) {
      return messageController.addMessageToTransaction(req.user, req.body.message, t._id)
        .then(() => t);
    }
    return t;
  })
    .then(data => res.json({ error: null, data }))
    .catch(err => res.status(500).json({ error: err.message }));
};


/**
 * POST /reviews
 * Add a review for a transaction
 */
exports.postReview = (req, res) => {
  // FIXME: Add subject?
  const review = new Review({
    timeSent: new Date(),
    text: req.body.text,
    rating: req.body.rating,
    _transaction: req.body.t_id,
    _creator: req.user.id,
  });

  review.save()
    .then(data => res.json({ error: null, data }))
    .catch(err => res.status(500).json({ error: err.message }));
};
