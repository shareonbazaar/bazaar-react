import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

const messages = defineMessages({
  confirmLocal: {
    id: 'Onboarding.confirmLocal',
    defaultMessage: 'Please confirm that you are a local',
  },
  confirmNewcomer: {
    id: 'Onboarding.confirmNewcomer',
    defaultMessage: 'Please confirm that you are a newcomer',
  },
  newcomer: {
    id: 'Onboarding.newcomer',
    defaultMessage: 'I am a newcomer',
  },
  local: {
    id: 'Onboarding.local',
    defaultMessage: 'I am a local',
  },
  yesNewcomer: {
    id: 'Onboarding.yesNewcomer',
    defaultMessage: 'Yes I am a newcomer',
  },
  noNewcomer: {
    id: 'Onboarding.noNewcomer',
    defaultMessage: 'No I am not a newcomer',
  },
  yesLocal: {
    id: 'Onboarding.yesLocal',
    defaultMessage: 'Yes I am a local',
  },
  noLocal: {
    id: 'Onboarding.noLocal',
    defaultMessage: 'No I am not a local',
  },
  newcomerText: {
    id: 'Onboarding.newcomerText',
    defaultMessage: 'You are new to Germany and want to meet new friends, learn new skills and develop your career.',
  },
  localText: {
    id: 'Onboarding.localText',
    defaultMessage: `You have been in Germany for a while and you are excited to build a more
    culturally diverse landscape, through learning from different cultures and traditions, and
    contributing your own skills to the community.`,
  }
});

class StatusOption extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }

  render () {
    const { showModal } = this.state;
    const { title, text, buttonText, confirmationText, negatoryText, className, onClick, faded } = this.props;
    return (
      <div className={`status-option ${className || ''}`}>
        <Modal className='onboarding-modal' show={showModal} onHide={() => this.setState({showModal: false})}>
          <Modal.Body>
            <h3>{title}</h3>
            <p>{text}</p>
            <div className="choices">
              <Button block onClick={() => { this.setState({showModal: false}); onClick(); }}>
                {confirmationText}
              </Button>
              <Button block onClick={() => this.setState({showModal: false})}>
                {negatoryText}
              </Button>
            </div>
          </Modal.Body>
        </Modal>
        <Button className={`${ faded ? 'faded' : ''}`} onClick={() => this.setState({showModal: true})} bsStyle="primary" bsSize="large" block>
          {buttonText}
        </Button>
      </div>
    )
  }
}

function NewcomerStatus (props) {
  const { formatMessage } = props.intl;
  const { onNewcomerSelect, isNewcomer } = props;
  return (
    <div className="newcomer-status">
      <h3>
        <FormattedMessage
          id={'Onboarding.describe'}
          defaultMessage={'How would you describe yourself?'}
        />
      </h3>

      <StatusOption
        title={formatMessage(messages.confirmNewcomer)}
        text={formatMessage(messages.newcomerText)}
        buttonText={formatMessage(messages.newcomer)}
        confirmationText={formatMessage(messages.yesNewcomer)}
        negatoryText={formatMessage(messages.noNewcomer)}
        onClick={() => onNewcomerSelect(true)}
        faded={isNewcomer == null ? false : !isNewcomer}
      />

      <StatusOption
        className="local"
        title={formatMessage(messages.confirmLocal)}
        text={formatMessage(messages.localText)}
        buttonText={formatMessage(messages.local)}
        confirmationText={formatMessage(messages.yesLocal)}
        negatoryText={formatMessage(messages.noLocal)}
        onClick={() => onNewcomerSelect(false)}
        faded={isNewcomer == null ? false : isNewcomer}
      />
    </div>
  )
}

export default injectIntl(NewcomerStatus);
