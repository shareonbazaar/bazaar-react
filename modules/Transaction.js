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
import { setTransactionStatus } from '../utils/actions'
import AcceptanceModal from './AcceptanceModal';



const verbs = {
    [RequestType.LEARN]: {
        [StatusType.PROPOSED]: 'will receive',
        [StatusType.ACCEPTED]: 'will receive',
        [StatusType.COMPLETE]: 'received',
    },
    [RequestType.SHARE]: {
        [StatusType.PROPOSED]: 'will give',
        [StatusType.ACCEPTED]: 'will give',
        [StatusType.COMPLETE]: 'gave',
    },
    [RequestType.EXCHANGE]: {
        [StatusType.PROPOSED]: 'will exchange',
        [StatusType.ACCEPTED]: 'will exchange',
        [StatusType.COMPLETE]: 'exchanged',
    }
}

const ProposedButtons = connect(null, (dispatch) => {
    return {
        setTransactionStatus: (t_id, status) => {
            dispatch(setTransactionStatus(t_id, status));
        }
    }
}) (props => {
    if (props.userIsOwner) {
        return (
            <Row className='responses'>
                <Col mdOffset={3} md={6}>
                    <Button onClick={()=> props.setTransactionStatus(props.content._id, StatusType.CANCELLED)}
                            bsStyle="danger">Cancel
                    </Button>
                </Col>
            </Row>
        )
    } else {
        return (
            <Row className='responses'>
                <Col xs={4}><AcceptanceModal skill={props.content.service.label.en} onConfirmation={() => props.setTransactionStatus(props.content._id, StatusType.ACCEPTED)}/></Col>
                <Col xs={4}><Button onClick={props.onChatClick} bsStyle='primary'>Chat</Button></Col>
                <Col xs={4}><Button onClick={() => props.setTransactionStatus(props.content._id, StatusType.REJECTED)} bsStyle='danger'>Reject</Button></Col>
            </Row>
        )
    }
})


function Proposed (props) {
    return (
        <Grid fluid={true}>
            <Row>
                <Col mdOffset={3} md={6}>
                    <div className='intro'>Message</div>
                </Col>
            </Row>
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
        } else if (this.props.status === StatusType.ACCEPTED) {
            return <Upcoming content={this.props.content} collapsed={this.props.collapsed} onChatClick={this.onChatClick} />
        } else {
            return <Complete transaction={this.props.content}
                             user={this.props.user}
                             partner={this.props.partner}
                             userIsOwner={this.props.userIsOwner} />
        }
    }
}

export default class Transaction extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            collapsed: true,
        }
    }

    render () {
        const partner = this.props.content._participants.find(user => user._id !== this.props.user._id);
        const userIsOwner = this.props.content._creator._id == this.props.user._id
        const subject =  userIsOwner ? 'You' : partner.profile.name.split(' ')[0];
        return (
            <div className='transaction'>
                <div className='t-wrapper' onClick={() => this.setState({ collapsed: !this.state.collapsed })}>
                    <div className='content'>
                        <div><img className='direction' src='/images/arrow_left_down.png' /></div>
                        <Identity imageUrl={partner.profile.picture} name={partner.profile.name.split(' ')[0]}/>
                        <div className='exchange'>
                            <div className='request-type'>{subject + " " + verbs[this.props.content.request_type][this.props.content.status]}</div>
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

