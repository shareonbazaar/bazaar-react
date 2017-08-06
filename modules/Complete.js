import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StatusType } from '../models/Enums';
import { submitReview, updateTransaction } from '../utils/actions';
import ConfirmationModal from './ConfirmationModal';
import ReviewModal from './ReviewModal';
import Review from './Review';

const writeReviewMessage = "Please write a review for this exchange. You won't be able to see your partner's review until you write one";
const submittedReviewMessage = "Thank you for submitting a review. As soon as your partner submits one, you'll be able to see it.";
const markedExchangeCompleteMessage = 'Your partner has marked this exchange as complete. Please confirm completion';
const pendingReviewMessage = 'This exchange is pending confirmation from the other person that it has been completed.';

//eslint-disable-next-line
class Complete extends React.Component {
  render() {
    const { partner, submitReviewProp, transaction, user, userIsOwner } = this.props;
    if (transaction.status === StatusType.COMPLETE) {
      const userReview = transaction._reviews.find(review => review._creator === user._id);
      const partnerReview = transaction._reviews.find(review => review._creator === partner._id);
      if (!userReview) {
        return (
          <div className="notice">
            {writeReviewMessage}
            <ReviewModal
              onSubmit={submitReviewProp}
              transaction={transaction}
            />
          </div>
        );
      } else if (!partnerReview) {
        return (
          <div className="notice">
            {submittedReviewMessage}
          </div>
        );
        //eslint-disable-next-line
      } else {
        return (
          <div className="notice">
            <Review review={partnerReview} />
          </div>
        );
      }
    } else if ((userIsOwner && transaction.status === StatusType.RECIPIENT_ACK)
            || (!userIsOwner && transaction.status === StatusType.SENDER_ACK)) {
      return (
        <div className="notice">
          {markedExchangeCompleteMessage}
          <ConfirmationModal
            onConfirmation={
              //eslint-disable-next-line
              () => this.props.updateTransaction(
                this.props.transaction._id,
                { status: StatusType.COMPLETE }
              )
            }
            title="Did this exchange take place?"
            buttonText="Confirm Exchange"
            cancelStyle="danger"
            confirmStyle="primary"
            buttonStyle="primary"
          />
        </div>
      );
    } else {
      return (
        <div className="notice">
          {pendingReviewMessage}
        </div>
      );
    }
  }
}
Complete.propTypes = {
  partner: PropTypes.node,
  submitReviewProp: PropTypes.func,
  transaction: PropTypes.node,
  user: PropTypes.node,
  userIsOwner: PropTypes.bool,
};
Complete.defaultProps = {
  partner: null,
  submitReviewProp: () => {},
  transaction: null,
  user: null,
  userIsOwner: false,
};

export default connect(null, { updateTransaction, submitReview })(Complete);
