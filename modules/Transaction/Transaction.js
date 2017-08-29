import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, Grid, Col, Row, Button } from 'react-bootstrap';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { RequestType, StatusType } from '../../models/Enums';
import Identity from '../Identity/Identity';
import Upcoming from '../Upcoming/Upcoming';
// import ConfirmationModal from './ConfirmationModal';

import Chat from '../Chat/Chat';
import Complete from '../Complete/Complete';
import { updateTransaction } from '../../utils/actions';
import AcceptanceModal from '../AcceptanceModal/AcceptanceModal';

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

// eslint-disable-next-line
const ProposedButtons = connect(null, { updateTransaction })(props => {
  const { userIsOwner, content } = props;
  if (userIsOwner) {
    return (
      <Row className="responses">
        <Col mdOffset={3} md={6}>
          <Button
            bsStyle="danger"
            onClick={() => props.updateTransaction({
              t_id: content._id,
              transaction: { status: StatusType.CANCELLED },
            })}
          >
            <FormattedMessage
              id={'Transaction.cancel'}
              defaultMessage={'Cancel'}
            />
          </Button>
        </Col>
      </Row>
    );
  // eslint-disable-next-line
  } else {
    return (
      <Row className="responses">
        <Col xs={4}>
          <AcceptanceModal
            skill={props.content.service.label.en}
            onConfirmation={msg => props.updateTransaction({
              t_id: props.content._id,
              transaction: { status: StatusType.ACCEPTED },
              message: msg,
            })}
          />
        </Col>
        <Col xs={4}>
          <Button onClick={props.onChatClick} bsStyle="primary">
            <FormattedMessage
              id={'Transaction.chat'}
              defaultMessage={'Chat'}
            />
          </Button>
        </Col>
        <Col xs={4}>
          <Button
            bsStyle="danger"
            onClick={() => props.updateTransaction({
              t_id: props.content._id,
              transaction: { status: StatusType.REJECTED },
            })}
          >
            <FormattedMessage
              id={'Transaction.reject'}
              defaultMessage={'Reject'}
            />
          </Button>
        </Col>
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
  content: PropTypes.object,
  onChatClick: PropTypes.func,
  userIsOwner: PropTypes.bool,
};

Proposed.defaultProps = {
  content: {},
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
    const { content, collapsed, partner, status, user, userIsOwner } = this.props;
    const { inChatMode } = this.state;
    if (inChatMode) {
      return (
        <Chat
          t_id={content._id}
          onBack={this.onChatClick}
          messages={content._messages}
        />
      );
    } else if (status === StatusType.PROPOSED) {
      return (
        <Proposed
          content={content}
          userIsOwner={userIsOwner}
          onChatClick={this.onChatClick}
        />
      );
    // eslint-disable-next-line
    } else if (status === StatusType.ACCEPTED && content._confirmations.length == 0) {
      return (
        <Upcoming
          content={content}
          collapsed={collapsed}
          onChatClick={this.onChatClick}
        />
      );
    // eslint-disable-next-line
    } else {
      return (
        <Complete
          transaction={content}
          user={user}
          partner={partner}
        />
      );
    }
  }
}

TransactionCollapsable.propTypes = {
  content: PropTypes.object,
  userIsOwner: PropTypes.bool,
  status: PropTypes.string,
  user: PropTypes.object,
  partner: PropTypes.object,
  collapsed: PropTypes.bool,
};

TransactionCollapsable.defaultProps = {
  content: {},
  userIsOwner: false,
  status: '',
  user: {},
  partner: {},
  collapsed: true,
};
// eslint-disable-next-line
class Transaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { collapsed } = this.state;
    const verbs = (past) => {
      if (past) {
        return {
          [RequestType.LEARN]: formatMessage(messages.receivePast),
          [RequestType.SHARE]: formatMessage(messages.givePast),
          [RequestType.EXCHANGE]: formatMessage(messages.exchangePast),
        };
      // eslint-disable-next-line
      } else {
        return {
          [RequestType.LEARN]: formatMessage(messages.receiveFuture),
          [RequestType.SHARE]: formatMessage(messages.giveFuture),
          [RequestType.EXCHANGE]: formatMessage(messages.exchangeFuture),
        };
      }
    };
    const { content, loggedInUser } = this.props;
    const partner = content._participants.find(user => user._id !== loggedInUser._id);
    const userIsOwner = content._creator._id === loggedInUser._id;
    const subject = userIsOwner ? formatMessage(messages.you) : partner.profile.name.split(' ')[0];
    return (
      <div className="transaction">
        <div className="t-wrapper" onClick={() => this.setState({ collapsed: !collapsed })}>
          <div className="content">
            <div><img alt="" className="direction" src="/images/arrow_left_down.png" /></div>
            <Identity imageUrl={partner.profile.picture} name={partner.profile.name.split(' ')[0]} />
            <div className="exchange">
              <div className="request-type">
                {`${subject} ${verbs(this.props.content._confirmations.length > 0)[content.request_type]}`}
              </div>
              <div className="service">{content.service.label.en}</div>
            </div>
          </div>
          <time className="timestamp">{moment(content.createdAt).fromNow()}</time>
        </div>
        <Collapse in={!collapsed}>
          <div className="action-area">
            <TransactionCollapsable
              onChatClick={this.onChatClick}
              status={content.status}
              userIsOwner={userIsOwner}
              user={loggedInUser}
              partner={partner}
              content={content}
              collapsed={collapsed}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}

Transaction.propTypes = {
  content: PropTypes.object,
  loggedInUser: PropTypes.object,
  intl: PropTypes.object,
};

Transaction.defaultProps = {
  content: {},
  loggedInUser: {},
  intl: {},
};

export default (injectIntl(Transaction));
