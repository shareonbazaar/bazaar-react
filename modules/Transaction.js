import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import {RequestType, StatusType} from '../models/Enums'
import { Collapse, Grid, Col, Row, Button } from 'react-bootstrap';
import Identity from './Identity'
import Upcoming from './Upcoming'
import ConfirmationModal from './ConfirmationModal'
import WriteReviewButton from './WriteReviewButton'
import Chat from './Chat';
import Complete from './Complete';
import { updateTransaction } from '../utils/actions'
import AcceptanceModal from './AcceptanceModal';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

const messages = defineMessages({
    receivePast: {
        id: 'Transaction.receivePast',
        defaultMessage: 'received',
    },
    receiveFuture: {
        id: 'Transaction.receiveFuture',
        defaultMessage: 'will receive',
    },
    givePast: {
        id: 'Transaction.givePast',
        defaultMessage: 'gave',
    },
    giveFuture: {
        id: 'Transaction.giveFuture',
        defaultMessage: 'will give',
    },
    exchangePast: {
        id: 'Transaction.exchangePast',
        defaultMessage: 'exchanged',
    },
    exchangeFuture: {
        id: 'Transaction.exchangeFuture',
        defaultMessage: 'will exchange',
    },
    you: {
        id: 'Transaction.you',
        defaultMessage: 'You',
    },
});


const ProposedButtons = connect(null, { updateTransaction }) (props => {
    if (props.userIsOwner) {
        return (
            <Row className='responses'>
                <Col mdOffset={3} md={6}>
                    <Button bsStyle='danger'
                            onClick={()=> props.updateTransaction({
                                t_id: props.content._id,
                                transaction: {status: StatusType.CANCELLED},
                            })}
                            >
                    <FormattedMessage
                      id={'Transaction.cancel'}
                      defaultMessage={'Cancel'}
                    />
                    </Button>
                </Col>
            </Row>
        )
    } else {
        return (
            <Row className='responses'>
                <Col xs={4}><AcceptanceModal
                                skill={props.content.service.label.en}
                                onConfirmation={(msg) => props.updateTransaction({
                                    t_id: props.content._id,
                                    transaction: {status: StatusType.ACCEPTED},
                                    message: msg,
                                })}
                            />
                </Col>
                <Col xs={4}>
                    <Button onClick={props.onChatClick} bsStyle='primary'>
                        <FormattedMessage
                          id={'Transaction.chat'}
                          defaultMessage={'Chat'}
                        />
                    </Button>
                </Col>
                <Col xs={4}>
                    <Button bsStyle='danger'
                            onClick={() => props.updateTransaction({
                                t_id: props.content._id,
                                transaction: {status: StatusType.REJECTED},
                            })}
                            >
                        <FormattedMessage
                          id={'Transaction.reject'}
                          defaultMessage={'Reject'}
                        />
                    </Button>
                </Col>
            </Row>
        )
    }
})


function Proposed (props) {
    return (
        <Grid fluid={true}>
            {
                props.content._messages.length > 0
                &&
                <Row>
                    <Col mdOffset={3} md={6}>
                        <div className='intro'>{props.content._messages[0].message}</div>
                    </Col>
                </Row>
            }
            <ProposedButtons content={props.content} onChatClick={props.onChatClick} userIsOwner={props.userIsOwner} />
        </Grid>
    )
}



class TransactionCollapsable extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            inChatMode: false,
        }
        this.onChatClick = this.onChatClick.bind(this);
    }

    onChatClick () {
        this.setState({
            inChatMode: !this.state.inChatMode,
        });
    }

    render () {
        if (this.state.inChatMode) {
            return <Chat t_id={this.props.content._id} onBack={this.onChatClick} messages={this.props.content._messages} />
        } else if (this.props.status === StatusType.PROPOSED) {
            return <Proposed content={this.props.content} userIsOwner={this.props.userIsOwner} onChatClick={this.onChatClick} />
        } else if (this.props.status === StatusType.ACCEPTED && this.props.content._confirmations.length == 0) {
            return <Upcoming content={this.props.content} collapsed={this.props.collapsed} onChatClick={this.onChatClick} />
        } else {
            return <Complete transaction={this.props.content}
                             user={this.props.user}
                             partner={this.props.partner} />
        }
    }
}

class Transaction extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
        }
    }

    render () {
        const {formatMessage} = this.props.intl;
        const verbs = (past) => {
            if (past) {
                return {
                    [RequestType.LEARN]: formatMessage(messages.receivePast),
                    [RequestType.SHARE]: formatMessage(messages.givePast),
                    [RequestType.EXCHANGE]: formatMessage(messages.exchangePast),
                }
            } else {
                return {
                    [RequestType.LEARN]: formatMessage(messages.receiveFuture),
                    [RequestType.SHARE]: formatMessage(messages.giveFuture),
                    [RequestType.EXCHANGE]: formatMessage(messages.exchangeFuture),
                }
            }
        }
        const partner = this.props.content._participants.find(user => user._id !== this.props.user._id);
        const userIsOwner = this.props.content._creator._id == this.props.user._id
        const subject =  userIsOwner ? formatMessage(messages.you) : partner.profile.name.split(' ')[0];
        return (
            <div className='transaction'>
                <div className='t-wrapper' onClick={() => this.setState({ collapsed: !this.state.collapsed })}>
                    <div className='content'>
                        <div><img className='direction' src='/images/arrow_left_down.png' /></div>
                        <Identity imageUrl={partner.profile.picture} name={partner.profile.name.split(' ')[0]}/>
                        <div className='exchange'>
                            <div className='request-type'>{subject + " " + verbs(this.props.content._confirmations.length > 0)[this.props.content.request_type]}</div>
                            <div className='service'>{this.props.content.service.label.en}</div>
                        </div>
                    </div>
                    <time className='timestamp'>{moment(this.props.content.createdAt).fromNow()}</time>
                </div>
                <Collapse in={!this.state.collapsed}>
                    <div className='action-area'>
                        <TransactionCollapsable onChatClick={this.onChatClick}
                                                status={this.props.content.status}
                                                userIsOwner={userIsOwner}
                                                user={this.props.user}
                                                partner={partner}
                                                content={this.props.content}
                                                collapsed={this.state.collapsed} />
                    </div>
                </Collapse>
            </div>
        )
  }
}

export default (injectIntl(Transaction));

