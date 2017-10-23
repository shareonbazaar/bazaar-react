import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';

import { Header2, Text } from '../Layout/Headers';
import ActionButton from '../Actions/ActionButton';

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

  render() {
    const { showModal } = this.state;
    const { title, text, buttonText, confirmationText, negatoryText, onClick, style, faded } = this.props;
    return (
      <div style={style}>
        <Modal show={showModal} onHide={() => this.setState({ showModal: false })}>
          <Modal.Body>
            <Header2 style={{ fontWeight: 'bold' }}>{title}</Header2>
            <Text>{text}</Text>
            <div className="choices">
              <ActionButton block onClick={() => { this.setState({ showModal: false }); onClick(); }}>
                {confirmationText}
              </ActionButton>
              <ActionButton block onClick={() => this.setState({ showModal: false })}>
                {negatoryText}
              </ActionButton>
            </div>
          </Modal.Body>
        </Modal>
        <Button
          onClick={() => this.setState({ showModal: true })}
          style={{
            width: '100%',
            opacity: faded ? 0.3 : 1,
          }}
        >
          {buttonText}
        </Button>
      </div>
    );
  }
}

StatusOption.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  confirmationText: PropTypes.string.isRequired,
  negatoryText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  faded: PropTypes.bool.isRequired,
};

StatusOption.defaultProps = {
  style: {},
};

function NewcomerStatus(props) {
  const { formatMessage } = props.intl;
  const { onNewcomerSelect, isNewcomer } = props;
  const statusStyle = {
    display: 'inline-block',
    width: '46%',
    margin: '0 1%',
  };
  return (
    <div style={{ margin: '10px 0' }}>
      <Header2>
        <FormattedMessage
          id={'Onboarding.describe'}
          defaultMessage={'How would you describe yourself?'}
        />
      </Header2>

      <StatusOption
        title={formatMessage(messages.confirmNewcomer)}
        text={formatMessage(messages.newcomerText)}
        buttonText={formatMessage(messages.newcomer)}
        confirmationText={formatMessage(messages.yesNewcomer)}
        negatoryText={formatMessage(messages.noNewcomer)}
        onClick={() => onNewcomerSelect(true)}
        faded={isNewcomer == null ? false : !isNewcomer}
        style={statusStyle}
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
        style={statusStyle}
      />
    </div>
  );
}

NewcomerStatus.propTypes = {
  onNewcomerSelect: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isNewcomer: PropTypes.bool,
};

NewcomerStatus.defaultProps = {
  isNewcomer: null,
};

export default injectIntl(NewcomerStatus);
