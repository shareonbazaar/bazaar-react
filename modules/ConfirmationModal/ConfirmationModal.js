import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

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
        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
          </Modal.Header>

          <Modal.Footer>
            <Button
              onClick={() => this.setState({ showModal: false })}
              bsStyle={cancelStyle}
            >
              <FormattedMessage
                id={'ConfirmationModal.cancel'}
                defaultMessage={'Cancel'}
              />
            </Button>
            <Button
              onClick={() => { this.setState({ showModal: false }); this.props.onConfirmation(); }}
              bsStyle={confirmStyle}
            >
              <FormattedMessage
                id={'ConfirmationModal.yes'}
                defaultMessage={'Yes'}
              />
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
  onConfirmation: () => {},
};

const buttonStyles = ['success', 'warning', 'danger', 'info', 'default', 'primary', 'link'];
ConfirmationModal.propTypes = {
  buttonStyle: PropTypes.oneOf(buttonStyles),
  buttonText: PropTypes.string,
  title: PropTypes.string,
  cancelStyle: PropTypes.oneOf(buttonStyles),
  confirmStyle: PropTypes.oneOf(buttonStyles),
  onConfirmation: PropTypes.func,
};
