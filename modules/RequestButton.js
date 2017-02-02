import React from 'react'
import { Button, Modal, Grid, Row, Col, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';


export default class RequestButton extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            showModal: false,
            selectedLabel: '',
        };
        this.onClose = this.onClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onSkillClick = this.onSkillClick.bind(this);
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

    onSkillClick (event) {
        this.setState({
            selectedLabel: event.target.innerHTML,
        });
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
                                <Col xs={4} className='service-type'>Receive</Col>
                                <Col xs={4} className='service-type'>Give</Col>
                                <Col xs={4} className='service-type'>Exchange</Col>
                            </Row>
                        </Grid>
                        <form>
                            <FormGroup>
                                <ControlLabel>Request one skill:</ControlLabel>
                                <div className="skill-select">
                                    {this.props.user.skills.map((skill, i) => {
                                        var extraClass = this.state.selectedLabel == skill.label ? 'selected' : '';
                                        return <div  onClick={this.onSkillClick} key={i} className={'skill-label ' + extraClass}>{skill.label}</div>
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
                </Modal>
                <Button onClick={this.onOpen} bsStyle="primary" bsSize="large" block>Request</Button>
            </div>
        )
    }
}
