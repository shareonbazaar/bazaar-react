import React from 'react';
import MtSvgLines from 'react-mt-svg-lines';
import PropTypes from 'prop-types';
import { Button, Modal, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export default class AcceptanceModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }

  render() {
    const { showModal, message } = this.state;
    const { skill } = this.props;
    return (
      <div>
        <Button bsStyle="primary" onClick={() => this.setState({ showModal: true })}>Accept</Button>
        <Modal className="acceptModal" show={showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>
              <FormattedMessage
                id={'AcceptanceModal.confirm'}
                defaultMessage={'Confirm Acceptance'}
              />
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="checkmark">
              <MtSvgLines animate duration={2000}>
                <svg width="150" height="120">
                  <path stroke="green" strokeWidth="20" fill="none" d="M10,30 l30,50 l95,-70" />
                </svg>
              </MtSvgLines>
              <div>
                <FormattedMessage
                  id={'AcceptanceModal.getready'}
                  defaultMessage={'Get ready for {skill}'}
                  values={{ skill }}
                />
              </div>
            </div>
            <form>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage
                    id={'AcceptanceModal.message'}
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
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button onClick={() => this.setState({ showModal: false })} bsStyle="danger">
              <FormattedMessage
                id={'AcceptanceModal.close'}
                defaultMessage={'Close'}
              />
            </Button>
            <Button
              onClick={() => { this.setState({ showModal: false }); this.props.onConfirmation(message); }}
              bsStyle="primary"
            >
              <FormattedMessage
                id={'AcceptanceModal.confirm'}
                defaultMessage={'Confirm Acceptance'}
              />
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

AcceptanceModal.defaultProps = {
  skill: '',
  onConfirmation: () => {},
};

AcceptanceModal.propTypes = {
  skill: PropTypes.string,
  onConfirmation: PropTypes.func,
};
