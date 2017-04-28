import React from 'react'
import { Modal, Button } from 'react-bootstrap';

export default class ConfirmationModal extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    render () {
        return (
            <div>
                <Button bsStyle={this.props.buttonStyle} onClick={() => this.setState({showModal: true})}>{this.props.buttonText}</Button>
                <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.title}</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer>
                        <Button onClick={() => this.setState({showModal: false})} bsStyle={this.props.cancelStyle}>Cancel</Button>
                        <Button onClick={() => {this.setState({showModal: false}); this.props.onConfirmation()}} bsStyle={this.props.confirmStyle}>Yes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}
