import React from 'react'
import { connect } from 'react-redux'
import { skillRequest } from '../utils/actions'
import {RequestType, StatusType} from '../models/Enums'
import { Button, Modal, Grid, Row, Col, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';


class RequestButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
            selectedSkill: {
                _id: '',
                label: '',
            },
            exchange_type: RequestType.LEARN,
            message: '',
        };
        this.onClose = this.onClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onClose () {
        this.setState({
            showModal: false,
        });
    }

    onOpen () {
        this.setState({
            showModal: true,
        });
    }

    onSubmit (event) {
        this.props.skillRequest({
            sender: this.props.loggedInUser._id,
            recipient: this.props.user._id,
            service: this.state.selectedSkill._id,
            request_type: this.state.exchange_type,
            message: this.state.message,
        });
        this.setState({
            showModal: false,
        })
    }

    render () {
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.onClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Request from {this.props.user.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Grid fluid={true}>
                            <Row>
                                {
                                    [
                                        {
                                            exchange_type: RequestType.LEARN,
                                            label: "Receive",
                                        },
                                        {
                                            exchange_type: RequestType.SHARE,
                                            label: "Give",
                                        },
                                        {
                                            exchange_type: RequestType.EXCHANGE,
                                            label: "Exchange",
                                        }
                                    ].map(obj => {
                                        var extraClass = (this.state.exchange_type == obj.exchange_type) ? 'selected' : '';
                                        return <Col key={obj.exchange_type} xs={4} onClick={() => this.setState({exchange_type: obj.exchange_type})} className={'service-type ' + extraClass}>{obj.label}</Col>
                                    })
                                }
                            </Row>
                        </Grid>
                        <form>
                            <FormGroup>
                                <ControlLabel>Request one skill:</ControlLabel>
                                <div className="skill-select">
                                    {this.props.user.skills.map((skill, i) => {
                                        var extraClass = this.state.selectedSkill._id == skill._id ? 'selected' : '';
                                        return <div onClick={() => this.setState({selectedSkill: {_id: skill._id, label: skill.label.en}})} key={i} className={'skill-label ' + extraClass}>{skill.label.en}</div>
                                    })}
                                </div>
                            </FormGroup>
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
                        <Button bsStyle='primary' onClick={this.onSubmit}>Request</Button>
                    </Modal.Footer>
                </Modal>
                <Button onClick={this.onOpen} bsStyle="primary" bsSize="large" block>Request</Button>
            </div>
        )
    }
}

// These props come from the application's
// state when it is started
function mapStateToProps(state, ownProps) {
    return {
        loggedInUser: state.auth.user,
    }
}

export default connect(mapStateToProps, { skillRequest })(RequestButton);
