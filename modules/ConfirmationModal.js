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
                <Button onClick={() => this.setState({showModal: true})}>Mark Complete</Button>
                <Modal show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Did this exchange take place</Modal.Title>
                    </Modal.Header>

                    <Modal.Footer>
                        <Button onClick={() => this.setState({showModal: false})} bsStyle='danger'>Cancel</Button>
                        <Button onClick={() => {this.setState({showModal: false}); this.props.onConfirmation()}} bsStyle='primary'>Yes</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}
