import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { StatusType } from '../../src/utils/Enums';
import { submitReview, confirmTransaction } from '../../utils/actions';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import ReviewModal from '../ReviewModal/ReviewModal';
import Review from '../Review/Review';

const messages = defineMessages({
  confirmQuestion: {
    id: 'Complete.confirmquestion',
    defaultMessage: 'Did this exchange take place?',
  },
  confirmExchange: {
    id: 'Complete.confirmexchange',
    defaultMessage: 'Confirm exchange',
  },
});

const writeReviewMessage = "Please write a review for this exchange. You won't be able to see your partner's review until you write one";
const submittedReviewMessage = "Thank you for submitting a review. As soon as your partner submits one, you'll be able to see it.";
const markedExchangeCompleteMessage = 'Your partner has marked this exchange as complete. Please confirm completion';
const pendingReviewMessage = 'This exchange is pending confirmation from the other person that it has been completed.';

//eslint-disable-next-line
class Complete extends React.Component {
  render() {
    const { formatMessage } = this.props.intl;
    const { partner, transaction, user } = this.props;
    if (transaction.status === StatusType.COMPLETE) {
      // eslint-disable-next-line
      const userReview = transaction._reviews.find(review => review._creator._id == user._id);
      // eslint-disable-next-line
      const partnerReview = transaction._reviews.find(review => review._creator._id == partner._id);
      if (!userReview) {
        return (
          <div className="notice">
            <FormattedMessage
              id={'Complete.writereview'}
              defaultMessage={writeReviewMessage}
            />
            <ReviewModal
              onSubmit={this.props.submitReview}
              transaction={transaction}
            />
          </div>
        );
      } else if (!partnerReview) {
        return (
          <div className="notice">
            <FormattedMessage
              id={'Complete.submitthanks'}
              defaultMessage={submittedReviewMessage}
            />
          </div>
        );
        // eslint-disable-next-line
      } else {
        return (
          <div className="notice">
            <Review
              imageUrl={partner.profile.picture}
              name={partner.profile.name.split(' ')[0]}
              service={transaction.service.label.en}
              text={partnerReview.text}
              createdAt={partnerReview.createdAt}
              rating={partnerReview.rating}
            />
          </div>
        );
      }
    } else if (transaction._confirmations.indexOf(user._id) < 0) {
      return (
        <div className="notice">
          <FormattedMessage
            id={'Complete.confirm'}
            defaultMessage={markedExchangeCompleteMessage}
          />
          <ConfirmationModal
            onConfirmation={() => this.props.confirmTransaction({
              t_id: transaction._id,
            })}
            title={formatMessage(messages.confirmQuestion)}
            buttonText={formatMessage(messages.confirmExchange)}
            cancelStyle="danger"
            confirmStyle="primary"
            buttonStyle="primary"
          />
        </div>
      );
    } else {
      return (
        <div className="notice">
          <FormattedMessage
            id={'Complete.pending'}
            defaultMessage={pendingReviewMessage}
          />
        </div>
      );
    }
  }
}

Complete.propTypes = {
  partner: PropTypes.object,
  submitReview: PropTypes.func,
  confirmTransaction: PropTypes.func,
  intl: PropTypes.object,
  transaction: PropTypes.object,
  user: PropTypes.object,
  userIsOwner: PropTypes.bool,
};

Complete.defaultProps = {
  partner: {},
  submitReview: () => {},
  confirmTransaction: () => {},
  intl: {},
  transaction: {},
  user: {},
  userIsOwner: false,
};


export default connect(null, { submitReview, confirmTransaction })(injectIntl(Complete));
