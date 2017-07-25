import React from 'react'
import { connect } from 'react-redux'
import {RequestType, StatusType} from '../models/Enums'
import { submitReview, updateTransaction, confirmTransaction } from '../utils/actions'
import ConfirmationModal from './ConfirmationModal'
import ReviewModal from './ReviewModal'
import Review from './Review'
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

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

class Complete extends React.Component {

    render () {
        const {formatMessage} = this.props.intl;
        if (this.props.transaction.status === StatusType.COMPLETE) {
            var userReview = this.props.transaction._reviews.find(review => review._creator._id == this.props.user._id);
            var partnerReview = this.props.transaction._reviews.find(review => review._creator._id == this.props.partner._id);
            if (!userReview) {
                return (
                    <div className='notice'>
                        <FormattedMessage
                            id={'Complete.writereview'}
                            defaultMessage={"Please write a review for this exchange. You won't be able to see your partner's review until you write one"}
                        />
                        <ReviewModal
                            onSubmit={this.props.submitReview}
                            transaction={this.props.transaction} />
                    </div>
                )
            } else if (!partnerReview) {
                return (
                    <div className='notice'>
                        <FormattedMessage
                            id={'Complete.submitthanks'}
                            defaultMessage={"Thank you for submitting a review. As soon as your partner submits one, you'll be able to see it"}
                        />
                    </div>
                )
            } else {
                return (
                    <div className='notice'>
                        <Review
                            imageUrl={this.props.partner.profile.picture}
                            name={this.props.partner.profile.name.split(' ')[0]}
                            service={this.props.transaction.service.label.en}
                            text={partnerReview.text}
                            createdAt={partnerReview.createdAt}
                            rating={partnerReview.rating}
                        />
                    </div>
                )
            }
        } else if (this.props.transaction._confirmations.indexOf(this.props.user._id) < 0) {
                return (
                    <div className='notice'>
                        <FormattedMessage
                            id={'Complete.confirm'}
                            defaultMessage={"Your partner has marked this exchange as complete. Please confirm completion"}
                        />
                        <ConfirmationModal
                            onConfirmation={() => this.props.confirmTransaction({
                                t_id: this.props.transaction._id,
                            })}
                            title={formatMessage(messages.confirmQuestion)}
                            buttonText={formatMessage(messages.confirmExchange)}
                            cancelStyle='danger'
                            confirmStyle='primary'
                            buttonStyle='primary'
                            />
                    </div>
                )
        } else {
            return (
                <div className='notice'>
                    <FormattedMessage
                        id={'Complete.pending'}
                        defaultMessage={"This exchange is pending confirmation from the other person that it has been completed"}
                    />
                </div>
            )
        }
    }
}

export default connect(null, { updateTransaction, submitReview, confirmTransaction } )(injectIntl(Complete))

