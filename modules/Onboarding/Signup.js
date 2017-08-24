import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, Checkbox } from 'react-bootstrap';
import validator from 'email-validator';
import { FormattedMessage, injectIntl } from 'react-intl';

import NewcomerStatus from './NewcomerStatus';
import SocialMediaLogin from '../Authentication/SocialMediaLogin';
import ResponsiveInputField from '../Authentication/ResponsiveInputField';
import { signupMessages } from '../Authentication/messages';


class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      acceptsNewsletter: true,
      acceptsTerms: false,
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
      }
    });
  }

  renderSignupButton() {
    const { acceptsTerms } = this.state;
    return (
      <FormGroup>
        <div className="form-offset">
          <Button
            className="login-button"
            bsStyle="primary"
            type="submit"
            disabled={!acceptsTerms}
          >
            <FormattedMessage
              id={'Signup.signup'}
              defaultMessage={'Sign up'}
            />
          </Button>
        </div>
      </FormGroup>
    );
  }

  render() {
    const { formatMessage } = this.props.intl;
    const {
      firstName,
      lastName,
      emailText,
      password,
      acceptsNewsletter,
      acceptsTerms,
      hasClickedSignup
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
            _skills: this.props.chosenSkills.map(s => s._id),
            _interests: this.props.chosenInterests.map(s => s._id),
          }
        });
      }
      e.preventDefault();
    };
    return (
      <div className="signup">
        <NewcomerStatus />
        <FormGroup className="preferences">
          <Checkbox onChange={() => this.setState({ acceptsNewsletter: !acceptsNewsletter })} checked={acceptsNewsletter}>
            I want to receive a newsletter
          </Checkbox>

          <Checkbox onChange={() => this.setState({ acceptsTerms: !acceptsTerms })} checked={acceptsTerms}>
            I agree with the terms and conditions
          </Checkbox>
        </FormGroup>
        <SocialMediaLogin
          responseFacebook={this.responseFacebook}
          responseGoogle={this.responseGoogle}
          disabled={!acceptsTerms}
        />
        <p>Or sign up with your email</p>
        <form onSubmit={onSignupClicked}>
          <ResponsiveInputField
            formGroupIsValid={(hasClickedSignup && !firstNameValid)}
            formControlType="text"
            formControlValue={firstName}
            formControlPlaceHolder="John"
            formControlOnChange={(e) => { this.onChange(e, 'firstName'); }}
            messageText={formatMessage(signupMessages.firstName)}
          />
          <ResponsiveInputField
            formGroupIsValid={(hasClickedSignup && !lastNameValid)}
            formControlType="text"
            formControlValue={lastName}
            formControlPlaceHolder="Doe"
            formControlOnChange={(e) => { this.onChange(e, 'lastName'); }}
            messageText={formatMessage(signupMessages.lastName)}
          />
          <ResponsiveInputField
            formGroupIsValid={(hasClickedSignup && !emailValid)}
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
    );
  }
}

Signup.defaultProps = {
  isAuthenticated: false,
  location: {},
  push: () => {},
  loginUser: () => {},
  response: {},
  intl: null,
};
Signup.propTypes = {
  isAuthenticated: PropTypes.bool,
  location: PropTypes.object,
  push: PropTypes.func,
  loginUser: PropTypes.func,
  response: PropTypes.object,
  intl: PropTypes.object,
};

export default injectIntl(Signup);
