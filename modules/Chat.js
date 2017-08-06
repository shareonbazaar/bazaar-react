import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import io from 'socket.io-client';

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
    const { messages, textValue, onBack } = this.props;
    return (
      <div className="messaging">
        <div className="conversation">
          {messages.map((data, i) => this.renderMessage(data, i))}
        </div>
        <textarea
          onChange={(e) => { this.setState({ textValue: e.target.value }); }}
          value={textValue}
          placeholder="Write message"
          rows="4"
          className="messageInput"
        />
        <Button onClick={onBack}>Back</Button>
        <Button
          bsStyle="primary"
          className="sendButton"
          onClick={this.onSendMessage}
        >
          Send Message
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
  messages: PropTypes.node,
  currUser: PropTypes.node,
  t_id: PropTypes.string,
  onBack: PropTypes.func,
  textValue: PropTypes.string,
};
Chat.defaultProps = {
  messages: null,
  currUser: null,
  t_id: '',
  onBack: () => {},
  textValue: '',
};

export default connect(mapStateToProps, null)(Chat);
