import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Grid, Col, Row, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { RequestType, StatusType } from '../models/Enums';

import Identity from './Identity';
import Upcoming from './Upcoming';
// import ConfirmationModal from './ConfirmationModal';
// import WriteReviewButton from './WriteReviewButton';
import Chat from './Chat';
import Complete from './Complete';
import { updateTransaction } from '../utils/actions';
import AcceptanceModal from './AcceptanceModal';


const verbs = {
  [RequestType.LEARN]: {
    [StatusType.PROPOSED]: 'will receive',
    [StatusType.ACCEPTED]: 'will receive',
    [StatusType.COMPLETE]: 'received',
    [StatusType.SENDER_ACK]: 'received',
    [StatusType.RECIPIENT_ACK]: 'received',
  },
  [RequestType.SHARE]: {
    [StatusType.PROPOSED]: 'will give',
    [StatusType.ACCEPTED]: 'will give',
    [StatusType.COMPLETE]: 'gave',
    [StatusType.SENDER_ACK]: 'gave',
    [StatusType.RECIPIENT_ACK]: 'gave',
  },
  [RequestType.EXCHANGE]: {
    [StatusType.PROPOSED]: 'will exchange',
    [StatusType.ACCEPTED]: 'will exchange',
    [StatusType.COMPLETE]: 'exchanged',
    [StatusType.SENDER_ACK]: 'exchanged',
    [StatusType.RECIPIENT_ACK]: 'exchanged',
  }
};

const ProposedButtons = connect(null, { updateTransaction })((props) => {
  if (props.userIsOwner) {
    return (
      <Row className="responses">
        <Col mdOffset={3} md={6}>
          <Button
            onClick={() => props.updateTransaction(props.content._id, { status: StatusType.CANCELLED })}
            bsStyle="danger"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    );
    //eslint-disable-next-line
  } else {
    return (
      <Row className="responses">
        <Col xs={4}>
          <AcceptanceModal
            skill={props.content.service.label.en}
            onConfirmation={() => props.updateTransaction(props.content._id, { status: StatusType.ACCEPTED })}
          />
        </Col>
        <Col xs={4}><Button onClick={props.onChatClick} bsStyle="primary">Chat</Button></Col>
        <Col xs={4}><Button onClick={() => props.updateTransaction(props.content._id, { status: StatusType.REJECTED })} bsStyle="danger">Reject</Button></Col>
      </Row>
    );
  }
});


function Proposed(props) {
  return (
    <Grid fluid>
      {
        (props.content._messages.length > 0)
              &&
              <Row>
                <Col mdOffset={3} md={6}>
                  <div className="intro">{props.content._messages[0].message}</div>
                </Col>
              </Row>
      }
      <ProposedButtons content={props.content} onChatClick={props.onChatClick} userIsOwner={props.userIsOwner} />
    </Grid>
  );
}

Proposed.propTypes = {
  content: PropTypes.node,
  onChatClick: PropTypes.func,
  userIsOwner: PropTypes.bool,
};

Proposed.defaultProps = {
  content: null,
  onChatClick: () => {},
  userIsOwner: false,
};

class TransactionCollapsable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inChatMode: false,
    };
    this.onChatClick = this.onChatClick.bind(this);
  }

  onChatClick() {
    this.setState({
      inChatMode: !this.state.inChatMode,
    });
  }

  render() {
    const { content, status, collapsed, userIsOwner, partner, user } = this.props;
    if (this.state.inChatMode) {
      return (<Chat
        t_id={content._id}
        onBack={this.onChatClick}
        messages={content._messages}
      />);
    } else if (status === StatusType.PROPOSED) {
      return (<Proposed
        content={content}
        userIsOwner={userIsOwner}
        onChatClick={this.onChatClick}
      />);
    } else if (status === StatusType.ACCEPTED) {
      return (<Upcoming
        content={content}
        collapsed={collapsed}
        onChatClick={this.onChatClick}
      />);
    //eslint-disable-next-line
    } else {
      return (<Complete
        transaction={content}
        user={user}
        partner={partner}
        userIsOwner={userIsOwner}
      />);
    }
  }
}
TransactionCollapsable.propTypes = {
  content: PropTypes.node,
  userIsOwner: PropTypes.bool,
  status: PropTypes.string,
  user: PropTypes.node,
  partner: PropTypes.node,
  collapsed: PropTypes.bool,
};

TransactionCollapsable.defaultProps = {
  content: null,
  userIsOwner: false,
  status: '',
  user: null,
  partner: null,
  collapsed: true,
};
//eslint-disable-next-line
export default class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  render() {
    const { content, user } = this.props;
    const partner = content._participants.find(u => u._id !== user._id);
    const userIsOwner = content._creator._id === user._id;
    const subject = userIsOwner ? 'You' : partner.profile.name.split(' ')[0];
    return (
      <div className="transaction">
        <div className="t-wrapper" onClick={() => this.setState({ collapsed: !this.state.collapsed })}>
          <div className="content">
            <div><img alt="" className="direction" src="/images/arrow_left_down.png" /></div>
            <Identity imageUrl={partner.profile.picture} name={partner.profile.name.split(' ')[0]} />
            <div className="exchange">
              <div className="request-type">{`${subject} ${verbs[content.request_type][content.status]}`}</div>
              <div className="service">{content.service.label.en}</div>
            </div>
          </div>
          <time className="timestamp">{moment(content.createdAt).fromNow()}</time>
        </div>
        <Collapse in={!this.state.collapsed}>
          <div className="action-area">
            <TransactionCollapsable
              onChatClick={this.onChatClick}
              status={content.status}
              userIsOwner={userIsOwner}
              user={user}
              partner={partner}
              content={content}
              collapsed={this.state.collapsed}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}

Transaction.propTypes = {
  content: PropTypes.node,
  user: PropTypes.node,
};

Transaction.defaultProps = {
  content: null,
  user: null,
};
