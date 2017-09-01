import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, Alert, FormGroup } from 'react-bootstrap';
import validator from 'email-validator';
import { FormattedMessage, injectIntl } from 'react-intl';

import { submitContact, clearContactAlert } from '../../utils/actions';
import ResponsiveInputField from '../Authentication/ResponsiveInputField';
import { contactMessages } from './messages';

class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      message: '',
      hasClickedSubmit: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }
  renderHeader() {
    return (
      <div className="page-header">
        <h3>
          <FormattedMessage
            id={'Contact.header'}
            defaultMessage={'Contact Form'}
          />
        </h3>
      </div>
    );
  }
  renderSubmitButton() {
    return (
      <div className="save-button">
        <Button
          bsStyle="primary"
          type="submit"
        >
          <FormattedMessage
            id={'Contact.submit'}
            defaultMessage={'Submit'}
          />
        </Button>
      </div>
    );
  }
  render() {
    const { name, email, message, hasClickedSubmit } = this.state;
    const nameValid = name.length > 0;
    const emailValid = validator.validate(email);
    const messageValid = message.length > 0;
    const { response } = this.props;
    const { formatMessage } = this.props.intl;
    const onSubmitClicked = (e) => {
      this.setState({ hasClickedSubmit: true });
      if (nameValid && emailValid && messageValid) {
        this.props.submitContact(this.state);
      }
      e.preventDefault();
    };

    return (
      <div className="content-page contact-page">
        {this.renderHeader()}
        <form onSubmit={onSubmitClicked}>
          {response &&
            <Alert
              bsStyle={`${response.type === 'error' ? 'danger' : 'success'}`}
              onDismiss={this.props.clearContactAlert}
            >
              <p>{response.message}</p>
            </Alert>
          }
          <ResponsiveInputField
            formGroupIsValid={(hasClickedSubmit && !nameValid)}
            formControlType="name"
            formControlValue={name}
            formControlPlaceHolder="John Doe"
            formControlOnChange={(e) => { this.onChange(e, 'name'); }}
            messageText={formatMessage(contactMessages.name)}
          />
          <ResponsiveInputField
            formGroupIsValid={(hasClickedSubmit && !emailValid)}
            formControlType="email"
            formControlValue={email}
            formControlPlaceHolder="Email"
            formControlOnChange={(e) => { this.onChange(e, 'email'); }}
            messageText={formatMessage(contactMessages.email)}
          />
          <ResponsiveInputField
            className="label-top"
            formGroupIsValid={(hasClickedSubmit && !messageValid)}
            formControlType="textarea"
            formControlValue={message}
            formControlPlaceHolder="Enter text"
            formControlOnChange={(e) => { this.onChange(e, 'message'); }}
            messageText={formatMessage(contactMessages.message)}
            componentClass="textarea"
            rows={7}
            style={{ height: 160 }}
          />
          <hr />
          <FormGroup>
            {this.renderSubmitButton()}
          </FormGroup>
        </form>
      </div>
    );
  }
}

Contact.propTypes = {
  response: PropTypes.object,
  clearContactAlert: PropTypes.func,
  submitContact: PropTypes.func,
  intl: PropTypes.object,
};
Contact.defaultProps = {
  response: {},
  clearContactAlert: () => {},
  submitContact: () => {},
  intl: null,
};

const mapStateToProps = ({ contact }) => ({
  response: contact.response,
});

export default connect(mapStateToProps, { submitContact, clearContactAlert })(injectIntl(Contact));
