
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
// import validator from 'email-validator';
import { Button, FormGroup, FormControl, ControlLabel, Alert, Checkbox } from 'react-bootstrap';
import { updateProfile, deleteAccount, clearProfileAlert } from '../../utils/actions';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';


const messages = defineMessages({
  deleteaccount: {
    id: 'Settings.deleteaccount',
    defaultMessage: 'Delete Account',
  },
  reallydelete: {
    id: 'Settings.reallydelete',
    defaultMessage: 'Really delete?',
  },
});

const deleteMessage = 'You can delete your account, but keep in mind that this action is irreversible';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    const { loggedInUser } = this.props;
    this.state = {
      password: '',
      confirmPassword: '',
      hasClickedSubmit: false,
      acceptsEmails: Object.assign({}, loggedInUser.acceptsEmails),
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  render() {
    const { acceptsEmails, password, confirmPassword, hasClickedSubmit } = this.state;
    const { response } = this.props;
    const { formatMessage } = this.props.intl;
    const passwordValid = (password.length > 0 && password === confirmPassword);

    const onPasswordChange = () => {
      this.setState({ hasClickedSubmit: true });
      if (passwordValid) {
        const form = new FormData();
        form.append('password', password);
        this.props.updateProfile(form);
      }
    };
    const onEmailsChange = () => {
      const form = new FormData();
      form.append('acceptsEmails.newExchanges', acceptsEmails.newExchanges);
      form.append('acceptsEmails.updateExchanges', acceptsEmails.updateExchanges);
      form.append('acceptsEmails.newMessages', acceptsEmails.newMessages);
      this.props.updateProfile(form);
    };

    return (
      <div className="content-page settings-page">
        <div className="page-header">
          <h3>
            <FormattedMessage
              id={'Settings.changepassword'}
              defaultMessage={'Change Password'}
            />
          </h3>
        </div>
        <div>
          {this.props.response &&
            <Alert
              bsStyle={`${response.type === 'error' ? 'danger' : 'success'}`}
              onDismiss={this.props.clearProfileAlert}
            >
              <p>{response.message}</p>
            </Alert>
          }
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                id={'Settings.newpassword'}
                defaultMessage={'New Password'}
              />
            </ControlLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => { this.onChange(e, 'password'); }}
            />
          </FormGroup>
          <FormGroup validationState={(hasClickedSubmit && !passwordValid) ? 'error' : null}>
            <ControlLabel>
              <FormattedMessage
                id={'Settings.confirmpassword'}
                defaultMessage={'Confirm Password'}
              />
            </ControlLabel>
            <FormControl
              type="password"
              value={confirmPassword}
              onChange={(e) => { this.onChange(e, 'confirmPassword'); }}
            />
          </FormGroup>
          <hr />
          <FormGroup>
            <div className="save-button">
              <Button onClick={onPasswordChange} bsStyle="primary">
                <FormattedMessage
                  id={'Settings.changepassword'}
                  defaultMessage={'Change Password'}
                />
              </Button>
            </div>
          </FormGroup>
        </div>
        <div className="page-header">
          <h3>
            <FormattedMessage
              id={'Settings.sendemailsfor'}
              defaultMessage={'Send me emails for:'}
            />
          </h3>
        </div>
        <FormGroup>
          <Checkbox
            onChange={() => this.setState({ acceptsEmails: Object.assign({}, acceptsEmails, {
              newExchanges: !acceptsEmails.newExchanges
            }) })}
            checked={acceptsEmails.newExchanges}
          >
            <FormattedMessage
              id={'Settings.newexchanges'}
              defaultMessage={'New exchanges'}
            />
          </Checkbox>
          <Checkbox
            onChange={() => this.setState({ acceptsEmails: Object.assign({}, acceptsEmails, {
              updateExchanges: !acceptsEmails.updateExchanges
            }) })}
            checked={acceptsEmails.updateExchanges}
          >
            <FormattedMessage
              id={'Settings.updateexchanges'}
              defaultMessage={'Updates to exchanges'}
            />
          </Checkbox>
          <Checkbox
            onChange={() => this.setState({ acceptsEmails: Object.assign({}, acceptsEmails, {
              newMessages: !acceptsEmails.newMessages
            }) })}
            checked={acceptsEmails.newMessages}
          >
            <FormattedMessage
              id={'Settings.newchats'}
              defaultMessage={'New chat messages'}
            />
          </Checkbox>
        </FormGroup>
        <FormGroup>
          <div className="save-button">
            <Button onClick={onEmailsChange} bsStyle="primary">
              <FormattedMessage
                id={'Settings.save'}
                defaultMessage={'Save preferences'}
              />
            </Button>
          </div>
        </FormGroup>
        <div className="page-header">
          <h3>
            {formatMessage(messages.deleteaccount)}
          </h3>
        </div>
        <p>
          <FormattedMessage
            id={'Settings.confirmdelete'}
            defaultMessage={deleteMessage}
          />
        </p>
        <ConfirmationModal
          onConfirmation={this.props.deleteAccount}
          title={formatMessage(messages.reallydelete)}
          buttonText={formatMessage(messages.deleteaccount)}
          cancelStyle="default"
          confirmStyle="danger"
          buttonStyle="danger"
        />
      </div>
    );
  }
}

Settings.propTypes = {
  updateProfile: PropTypes.func,
  response: PropTypes.object,
  clearContactAlert: PropTypes.func,
  loggedInUser: PropTypes.object,
  deleteAccount: PropTypes.func,
  intl: PropTypes.object,
};

Settings.defaultProps = {
  updateProfile: () => {},
  response: {},
  clearContactAlert: () => {},
  loggedInUser: null,
  deleteAccount: () => {},
  intl: null,
};

// eslint-disable-next-line
const mapStateToProps = ({ auth }) => {
  return {
    loggedInUser: auth.user,
    response: auth.profileUpdateResponse
  };
};

export default connect(mapStateToProps, { updateProfile, deleteAccount, clearProfileAlert })(injectIntl(Settings));
