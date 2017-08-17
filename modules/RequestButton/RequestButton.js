import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, Grid, Row, Col, ControlLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';

import { skillRequest } from '../../utils/actions';
import { RequestType, StatusType } from '../../models/Enums';

const messages = defineMessages({
  receive: {
    id: 'RequestButton.receive',
    defaultMessage: 'Receive',
  },
  give: {
    id: 'RequestButton.give',
    defaultMessage: 'Give',
  },
  exchange: {
    id: 'RequestButton.exchange',
    defaultMessage: 'Exchange',
  },
});

class RequestButton extends React.Component {
  constructor(props) {
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

  onClose() {
    this.setState({
      showModal: false,
    });
  }

  onOpen() {
    this.setState({
      showModal: true,
    });
  }

  onSubmit() {
    const { loggedInUser, user } = this.props;
    const { selectedSkill, exchange_type, message } = this.state;
    if (!selectedSkill) {
      this.setState({
        errorMessage: 'Please select a skill',
      });
      return;
    }
    this.props.skillRequest({
      transaction: {
        _participants: [loggedInUser._id, user._id],
        amount: 1,
        _creator: loggedInUser._id,
        service: selectedSkill,
        request_type: exchange_type,
        status: StatusType.PROPOSED,
      },
      message,
    });
    this.setState({
      showModal: false,
      errorMessage: '',
    });
  }


  render() {
    const { formatMessage } = this.props.intl;
    const { user, loggedInUser } = this.props;
    const { exchange_type, showModal, errorMessage, selectedSkill, message } = this.state;
    let activities = [];
    switch (exchange_type) {
      default:
      case RequestType.LEARN:
        activities = user.skills;
        break;
      case RequestType.SHARE:
        activities = user.interests;
        break;
      case RequestType.EXCHANGE:
        activities = user.skills
          .filter(s => loggedInUser._skills.map(a => a._id).indexOf(s._id) >= 0);
        break;
    }
    return (
      <div>
        <Modal show={showModal} onHide={this.onClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage
                id={'RequestButton.request'}
                defaultMessage={'Request from {name}'}
                values={{ name: user.name }}
              />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Grid fluid>

              <Row>
                {
                  [
                    {
                      exchange_type: RequestType.LEARN,
                      label: formatMessage(messages.receive),
                    },
                    {
                      exchange_type: RequestType.SHARE,
                      label: formatMessage(messages.give),
                    },
                    {
                      exchange_type: RequestType.EXCHANGE,
                      label: formatMessage(messages.exchange),
                    }
                  ].map(obj => (
                    <Col
                      key={obj.exchange_type}
                      xs={4}
                      onClick={() => this.setState({ exchange_type: obj.exchange_type })}
                      className={`service-type ${((exchange_type === obj.exchange_type) ? 'selected' : '')}`}
                    >
                      {obj.label}
                    </Col>
                  ))
                }
              </Row>
            </Grid>
            <FormGroup>
              <ControlLabel>
                <FormattedMessage
                  id={'RequestButton.formtitle'}
                  defaultMessage={'Request one skill:'}
                />
              </ControlLabel>
              {errorMessage &&
                <Alert bsStyle="danger">
                  <p>{errorMessage}</p>
                </Alert>
              }
              <div className="skill-select">
                {activities.map((skill, i) => {
                  const extraClass = selectedSkill === skill._id ? 'selected' : '';
                  return (
                    <div
                      onClick={() => this.setState({ selectedSkill: skill._id })}
                      key={i}
                      className={`skill-label ${extraClass}`}
                    >
                      {skill.label.en}
                    </div>
                  );
                })}
              </div>
            </FormGroup>
            <FormGroup>
              <ControlLabel>
                <FormattedMessage
                  id={'RequestButton.message'}
                  defaultMessage={'Message:'}
                />
              </ControlLabel>
              <FormControl
                componentClass="textarea"
                value={message}
                placeholder="Enter text"
                onChange={e => this.setState({ message: e.target.value })}
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button bsStyle="primary" onClick={this.onSubmit}>
              <FormattedMessage
                id={'RequestButton.makerequest'}
                defaultMessage={'Request'}
              />
            </Button>
          </Modal.Footer>
        </Modal>
        <Button onClick={this.onOpen} bsStyle="primary" bsSize="large" block>
          <FormattedMessage
            id={'RequestButton.makerequest'}
            defaultMessage={'Request'}
          />
        </Button>
      </div>
    );
  }
}

RequestButton.propTypes = {
  skillRequest: PropTypes.func,
  loggedInUser: PropTypes.object,
  user: PropTypes.object,
  intl: PropTypes.object,
};

RequestButton.defaultProps = {
  skillRequest: () => {},
  loggedInUser: {},
  user: {},
  intl: null,
};

function mapStateToProps(state) {
  return {
    loggedInUser: state.auth.user,
  };
}
/*
 connect
 1. mapStateToProps

 2. mapDispatchToProps

 3.
 */
export default connect(mapStateToProps, { skillRequest })(injectIntl(RequestButton));
