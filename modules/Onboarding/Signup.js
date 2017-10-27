import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Alert } from 'react-bootstrap';
import validator from 'email-validator';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router';

import NewcomerStatus from './NewcomerStatus';
import SocialMediaLogin from '../Authentication/SocialMediaLogin';
import ResponsiveInputField from '../Authentication/ResponsiveInputField';
import { signupMessages } from '../Authentication/messages';
import ActionButton from '../Actions/ActionButton';


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      hasClickedSignup: false,
    };
    this.onChange = this.onChange.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      this.props.push('/editprofile');
    }
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  responseGoogle(response) {
    if (typeof response.error !== 'undefined') {
      return;
    }
    this.props.loginUser({
      endpoint: '/auth/google',
      data: {
        id_token: response.getAuthResponse().id_token,
        _skills: this.props.chosenSkills.map(s => s._id),
        _interests: this.props.chosenInterests.map(s => s._id),
        'profile.status': this.props.isNewcomer ? 'newcomer' : 'local',

      }
    });
  }

  responseFacebook(response) {
    this.props.loginUser({
      endpoint: '/auth/facebook',
      data: {
        access_token: response.accessToken,
        _skills: this.props.chosenSkills.map(s => s._id),
        _interests: this.props.chosenInterests.map(s => s._id),
        'profile.status': this.props.isNewcomer ? 'newcomer' : 'local',
      }
    });
  }

  renderSignupButton() {
    const { isNewcomer } = this.props;
    return (
      <FormGroup>
        <div className="form-offset">
          <ActionButton
            className="login-button"
            type="submit"
            disabled={isNewcomer === null}
            block
          >
            <FormattedMessage
              id={'Signup.signup'}
              defaultMessage={'Sign up'}
            />
          </ActionButton>
        </div>
      </FormGroup>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const { isNewcomer, loginResponse } = this.props;
    const {
      firstName,
      lastName,
      emailText,
      password,
      hasClickedSignup,
    } = this.state;
    const firstNameValid = firstName.length > 0;
    const lastNameValid = lastName.length > 0;
    const emailValid = validator.validate(emailText);
    const passwordsValid = (password.length > 0);

    const onSignupClicked = (e) => {
      this.setState({ hasClickedSignup: true });
      if (firstNameValid && lastNameValid && emailValid && passwordsValid) {
        this.props.loginUser({
          endpoint: '/api/signup',
          data: {
            firstName,
            lastName,
            email: emailText,
            password,
            'profile.status': isNewcomer ? 'newcomer' : 'local',
            _skills: this.props.chosenSkills.map(s => s._id),
            _interests: this.props.chosenInterests.map(s => s._id),
          }
        });
      }
      e.preventDefault();
    };
    return (
      <div className="signup">
        <NewcomerStatus
          {...this.props}
        />

        <div className={`account ${(isNewcomer !== null) ? 'visible' : 'invisible'}`}>
          <div>
            By signing up to Share on Bazaar I agree to the <Link to="/terms">terms and conditions</Link>
          </div>
          <SocialMediaLogin
            responseFacebook={this.responseFacebook}
            responseGoogle={this.responseGoogle}
            disabled={false}
          />
          <p>Or sign up with your email</p>
          <form onSubmit={onSignupClicked}>
            {loginResponse &&
              <Alert bsStyle="danger">
                <p>{loginResponse.message}</p>
              </Alert>
            }
            <ResponsiveInputField
              formGroupIsValid={(!hasClickedSignup || firstNameValid)}
              formControlType="text"
              formControlValue={firstName}
              formControlPlaceHolder="John"
              formControlOnChange={(e) => { this.onChange(e, 'firstName'); }}
              messageText={formatMessage(signupMessages.firstName)}
            />
            <ResponsiveInputField
              formGroupIsValid={(!hasClickedSignup || lastNameValid)}
              formControlType="text"
              formControlValue={lastName}
              formControlPlaceHolder="Doe"
              formControlOnChange={(e) => { this.onChange(e, 'lastName'); }}
              messageText={formatMessage(signupMessages.lastName)}
            />
            <ResponsiveInputField
              formGroupIsValid={(!hasClickedSignup || emailValid)}
              formControlType="email"
              formControlValue={emailText}
              formControlPlaceHolder="Email"
              formControlOnChange={(e) => { this.onChange(e, 'emailText'); }}
              messageText={formatMessage(signupMessages.email)}
            />
            <ResponsiveInputField
              formControlType="password"
              formControlValue={password}
              formControlPlaceHolder="Password"
              formControlOnChange={(e) => { this.onChange(e, 'password'); }}
              messageText={formatMessage(signupMessages.password)}
            />
            {this.renderSignupButton()}
          </form>
        </div>
      </div>
    );
  }
}

Signup.defaultProps = {
  isAuthenticated: false,
  loginResponse: null,
};
Signup.propTypes = {
  isAuthenticated: PropTypes.bool,
  isNewcomer: PropTypes.bool.isRequired,
  push: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  loginResponse: PropTypes.object,
  chosenSkills: PropTypes.array.isRequired,
  chosenInterests: PropTypes.array.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(Signup);
