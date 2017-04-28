import React from 'react'
import MtSvgLines from 'react-mt-svg-lines';
import { Button, Modal, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';


export default class AcceptanceModal extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
        }
    }

    render () {
        return (
            <div>
                <Button bsStyle='primary' onClick={() => this.setState({showModal: true})}>Accept</Button>
                <Modal className='acceptModal' show={this.state.showModal} onHide={() => this.setState({showModal: false})}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Acceptance</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className='checkmark'>
                            <MtSvgLines animate={ true } duration={ 2000 }>
                              <svg width="150" height="120">
                                <path stroke="green" strokeWidth="20" fill="none" d='M10,30 l30,50 l95,-70' />
                              </svg>
                            </MtSvgLines>
                            <div>Get ready for {this.props.skill}</div>
                        </div>
                        <form>
                            <FormGroup>
                                <ControlLabel>Message: </ControlLabel>
                                <FormControl
                                    componentClass="textarea"
                                    value={this.state.value}
                                    placeholder="Enter text"
                                    onChange={this.handleChange}
                                />
                            </FormGroup>
                        </form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={() => this.setState({showModal: false})} bsStyle='danger'>Close</Button>
                        <Button onClick={() => {this.setState({showModal: false}); this.props.onConfirmation()}} bsStyle='primary'>Confirm Acceptance</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }

}
