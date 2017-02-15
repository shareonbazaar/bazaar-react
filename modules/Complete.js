import React from 'react'
import { connect } from 'react-redux'
import {RequestType, StatusType} from '../models/Enums'
import { submitReview, setTransactionStatus } from '../utils/actions'
import ConfirmationModal from './ConfirmationModal'
import ReviewModal from './ReviewModal'

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
                <Review review={partnerReview} />
            }
        } else if ((this.props.userIsOwner && this.props.transaction.status == StatusType.RECIPIENT_ACK)
            || (!this.props.userIsOwner && this.props.transaction.status == StatusType.SENDER_ACK)) {
                return (
                    <div className='notice'>
                        Your partner has marked this exchange as complete. Please confirm completion
                        <ConfirmationModal
                            onConfirmation={() => this.props.setTransactionStatus(this.props.transaction._id, StatusType.COMPLETE)}
                            />
                    </div>
                )
        } else {
            return <div className='notice'>This exchange is pending confirmation from the other person that it has been completed.</div>
        }
    }
}

export default connect(null, (dispatch) => {
    return {
        setTransactionStatus: (t_id, status) => {
            dispatch(setTransactionStatus(t_id, status));   
        },
        submitReview: (data) => {
            dispatch(submitReview(data));
        },
    }
})(Complete)

