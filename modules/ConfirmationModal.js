import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';

export default class ConfirmationModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
  }
  render() {
    const { buttonStyle, buttonText, title, cancelStyle, confirmStyle } = this.props;
    return (
      <div>
        <Button
          bsStyle={buttonStyle}
          onClick={() => this.setState({ showModal: true })}
        >
          {buttonText}
        </Button>
        <Modal show={this.state.showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button
              onClick={() => this.setState({ showModal: false })}
              bsStyle={cancelStyle}
            >
            Cancel
            </Button>
            <Button
              onClick={() => {
                this.setState({ showModal: false });
                // eslint-disable-next-line
                this.props.onConfirmation();
              }}
              bsStyle={confirmStyle}
            >
            Yes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
ConfirmationModal.defaultProps = {
  buttonStyle: '',
  buttonText: '',
  title: '',
  cancelStyle: '',
  confirmStyle: '',
};

ConfirmationModal.propTypes = {
  buttonStyle: PropTypes.oneOf(['lg', 'large', 'sm', 'small', 'xs', 'xsmall']),
  buttonText: PropTypes.string,
  title: PropTypes.string,
  cancelStyle: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'default', 'primary', 'link']),
  confirmStyle: PropTypes.oneOf(['success', 'warning', 'danger', 'info', 'default', 'primary', 'link']),
};
