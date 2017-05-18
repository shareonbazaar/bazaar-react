import React from 'react'
import { connect } from 'react-redux'
import { skillRequest } from '../utils/actions'
import {RequestType, StatusType} from '../models/Enums'
import { Button, Modal, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';


class RequestButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
            selectedSkill: '',
            exchange_type: RequestType.LEARN,
            message: '',
            errorMessage: '',
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
        if (!this.state.selectedSkill) {
            this.setState({
                errorMessage: 'Please select a skill',
            });
            return;
        }
        this.props.skillRequest({
            sender: this.props.loggedInUser._id,
            recipient: this.props.user._id,
            service: this.state.selectedSkill,
            request_type: this.state.exchange_type,
            message: this.state.message,
        });
        this.setState({
            showModal: false,
            errorMessage: '',
        })
    }

    render () {
        let {user, loggedInUser} = this.props;
        let activities = [];
        switch (this.state.exchange_type) {
            case RequestType.LEARN:
                activities = user.skills;
                break;
            case RequestType.SHARE:
                activities = user.interests;
                break;
            case RequestType.EXCHANGE:
                activities = user.skills
                            .filter(s => loggedInUser._skills.map(a => a._id).indexOf(s._id) >= 0)
                break;
        }
        return (
            <div>
                <Modal show={this.state.showModal} onHide={this.onClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Request from {user.name}</Modal.Title>
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
                        <FormGroup>
                            <ControlLabel>Request one skill:</ControlLabel>
                            {this.state.errorMessage &&
                                <Alert bsStyle='danger'>
                                  <p>{this.state.errorMessage}</p>
                                </Alert>
                            }
                            <div className="skill-select">
                                {activities.map((skill, i) => {
                                    var extraClass = this.state.selectedSkill == skill._id ? 'selected' : '';
                                    return <div onClick={() => this.setState({selectedSkill: skill._id})} key={i} className={'skill-label ' + extraClass}>{skill.label.en}</div>
                                })}
                            </div>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Message: </ControlLabel>
                            <FormControl
                                componentClass="textarea"
                                value={this.state.message}
                                placeholder="Enter text"
                                onChange={e => this.setState({message: e.target.value})}
                            />
                        </FormGroup>
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
