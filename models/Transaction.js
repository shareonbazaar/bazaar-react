import mongoose from 'mongoose';
import Enums from './Enums';
import helpers from '../utils/helpers';

const transactionSchema = new mongoose.Schema({
  amount: Number,
  status: {
    type: String,
    enum: Object.keys(Enums.StatusType).map(key => Enums.StatusType[key]),
  },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
  request_type: {
    type: String,
    enum: Object.keys(Enums.RequestType).map(key => Enums.RequestType[key]),
  },
  _participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  _confirmations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loc: {
    type: { type: String },
    coordinates: { type: [], index: '2dsphere', get: helpers.NullInitialization }
  },
  placeName: String,
  happenedAt: Date,
}, { timestamps: true });

transactionSchema.index({ loc: '2dsphere' });

transactionSchema.pre('update', function (next) {
  if (this._update.$addToSet && this._update.$addToSet._confirmations) {
    this.findOne(this._conditions)
      .then((t) => {
        const userConfirmed = (u) => {
          const alreadyConfirmed = t._confirmations
            .map(i => i.toString())
            .indexOf(u.toString()) >= 0;

          const confirmingNow = (u.toString() === this._update.$addToSet._confirmations.toString());
          return alreadyConfirmed || confirmingNow;
        };

        if (t._participants.every(userConfirmed)) {
          this.update({ status: Enums.StatusType.COMPLETE });
        }

        next();
      });
  } else {
    next();
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
