import React from 'react'
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import io from 'socket.io-client';
const socket = io('/', {query: `token=${localStorage.getItem('token')}`});


function Message (props) {
    return (
        <div className={`message ${props.sentByCurrUser ? 'myself' : 'other-person' }`}>
            <div className='text'>{props.text}</div>
            <div className='author'>{props.author}</div>
        </div>
    )
}

class Chat extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            textValue: '',
            messages: this.props.messages.map((msg) => {
                return {
                    author: msg._sender.profile.name,
                    text: msg.message,
                    date: msg.createdAt,
                    sentByCurrUser: (this.props.currUser._id == msg._sender._id),
                }
            }),
        }

        this.onSendMessage = this.onSendMessage.bind(this);
    }

    componentDidMount () {
        socket.on('new message', data => {
            if (data.t_id !== this.props.t_id) return; // message not for this Chat!
            this.setState({
                messages: this.state.messages.concat([data])
            });
        })
    }

    onSendMessage () {
        var packet = {
            message: this.state.textValue,
            t_id: this.props.t_id,
        };
        socket.emit('send message', packet);
        this.setState({textValue: ''});
    }

    render () {
        return (
            <div className='messaging'>
                <div className='conversation'>
                    {this.state.messages.map((data, i) => {
                        return (
                            <Message sentByCurrUser={data.sentByCurrUser} key={i} author={data.author} text={data.text} />
                        )
                    })}
                </div>
                <textarea
                    onChange={(e) => {this.setState({textValue: e.target.value})}}
                    value={this.state.textValue}
                    placeholder='Write message'
                    rows='4'
                    className='messageInput'>
                </textarea>
                <Button onClick={this.props.onBack}>Back</Button>
                <Button bsStyle='primary' className='sendButton' onClick={this.onSendMessage}>Send Message</Button>
            </div>
        )
  }
}

const mapStateToProps = (state) => {
  return {
    currUser: state.auth.user,
  }
}

export default connect(mapStateToProps, null)(Chat);
