import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import { FormattedMessage } from 'react-intl';

const socket = io('/', { query: `token=${localStorage.getItem('token')}` });

function Message(props) {
  return (
    <div className={`message ${props.sentByCurrUser ? 'myself' : 'other-person'}`}>
      <div className="text">{props.text}</div>
      <div className="author">{props.author}</div>
    </div>
  );
}

class Chat extends React.Component {
  constructor(props) {
    super(props);
    const { messages, currUser } = props;
    this.state = {
      textValue: '',
      messages: messages.map(msg => ({
        // eslint-disable-next-line
        author: msg._sender.profile.name,
        text: msg.message,
        date: msg.createdAt,
        // eslint-disable-next-line
        sentByCurrUser: (currUser._id === msg._sender._id),
      })),
    };

    this.onSendMessage = this.onSendMessage.bind(this);
  }

  componentDidMount() {
    socket.on('new message', (data) => {
      if (data.t_id !== this.props.t_id) return; // message not for this Chat!
      this.setState({
        messages: this.state.messages.concat([data])
      });
    });
  }

  onSendMessage() {
    const packet = {
      message: this.state.textValue,
      t_id: this.props.t_id,
    };
    socket.emit('send message', packet);
    this.setState({ textValue: '' });
  }

  renderMessage(data, index) {
    return (
      <Message
        sentByCurrUser={data.sentByCurrUser}
        key={index}
        author={data.author}
        text={data.text}
      />
    );
  }

  render() {
    const { onBack } = this.props;
    const { messages } = this.state;

    return (
      <div className="messaging">
        <div className="conversation">
          {messages.map((data, i) => this.renderMessage(data, i))}
        </div>
        <textarea
          onChange={(e) => { this.setState({ textValue: e.target.value }); }}
          value={this.state.textValue}
          placeholder="Write message"
          rows="4"
          className="messageInput"
        />
        <Button onClick={onBack}>
          <FormattedMessage
            id={'Chat.back'}
            defaultMessage={'Back'}
          />
        </Button>
        <Button
          bsStyle="primary"
          className="sendButton"
          onClick={this.onSendMessage}
        >
          <FormattedMessage
            id={'Chat.send'}
            defaultMessage={'Send Message'}
          />
        </Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({ currUser: state.auth.user });

Message.propTypes = {
  sentByCurrUser: PropTypes.bool,
  text: PropTypes.string,
  author: PropTypes.string,
};
Message.defaultProps = {
  sentByCurrUser: false,
  text: '',
  author: '',
};

Chat.propTypes = {
  messages: PropTypes.array,
  currUser: PropTypes.object,
  t_id: PropTypes.string,
  onBack: PropTypes.func,
};
Chat.defaultProps = {
  messages: [],
  currUser: {},
  t_id: '',
  onBack: () => {},
};

export default connect(mapStateToProps, null)(Chat);
