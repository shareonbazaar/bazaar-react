import React from 'react'
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux'


function Message (props) {
    console.log(props.isCurrUser)
    return (
        <div className={'message ' + (props.isCurrUser ? 'other-person' : 'myself') }>
            <div className='text'>{props.message}</div>
            <div className='author'>{props.author}</div>
        </div>
    )
}

class Chat extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className='messaging'>
                <div className='conversation'>
                    {this.props.messages.map((data) => {
                        return (
                            <Message isCurrUser={this.props.currUser._id == data._sender._id} key={data._id} author={data._sender.name} message={data.message} />
                        )
                    })}
                </div>
                <textarea placeholder='Write message' rows='4' className='messageInput'></textarea>
                <Button onClick={this.props.onBack} bsStyle='info'>Back</Button>
                <Button bsStyle='primary' className='sendButton'>Send Message</Button>
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
