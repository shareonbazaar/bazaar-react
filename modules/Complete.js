import React from 'react'
import { connect } from 'react-redux'
import {RequestType, StatusType} from '../models/Enums'
import { submitReview, updateTransaction } from '../utils/actions'
import ConfirmationModal from './ConfirmationModal'
import ReviewModal from './ReviewModal'
import Review from './Review'

class Complete extends React.Component {

    render () {
        if (this.props.transaction.status === StatusType.COMPLETE) {
            var userReview = this.props.transaction._reviews.find(review => review._creator == this.props.user._id);
            var partnerReview = this.props.transaction._reviews.find(review => review._creator == this.props.partner._id);
            if (!userReview) {
                return (
                    <div className='notice'>
                        Please write a review for this exchange. You won't be able to see your partner's review until you write one
                        <ReviewModal
                            onSubmit={this.props.submitReview}
                            transaction={this.props.transaction} />
                    </div>
                )
            } else if (!partnerReview) {
                return (
                    <div className='notice'>Thank you for submitting a review. As soon as your partner submits one, you'll be able to see it.</div>
                )
            } else {
                return (
                    <div className='notice'>
                        <Review review={partnerReview} />
                    </div>
                )
            }
        } else if ((this.props.userIsOwner && this.props.transaction.status == StatusType.RECIPIENT_ACK)
            || (!this.props.userIsOwner && this.props.transaction.status == StatusType.SENDER_ACK)) {
                return (
                    <div className='notice'>
                        Your partner has marked this exchange as complete. Please confirm completion
                        <ConfirmationModal
                            onConfirmation={() => this.props.updateTransaction({
                                t_id: this.props.transaction._id,
                                transaction: {
                                    status: StatusType.COMPLETE
                                }
                            })}
                            title='Did this exchange take place?'
                            buttonText='Confirm Exchange'
                            cancelStyle='danger'
                            confirmStyle='primary'
                            buttonStyle='primary'
                            />
                    </div>
                )
        } else {
            return <div className='notice'>This exchange is pending confirmation from the other person that it has been completed.</div>
        }
    }
}

export default connect(null, { updateTransaction, submitReview } )(Complete)

