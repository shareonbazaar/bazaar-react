import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { push } from 'react-router-redux';
import { Button, Grid, Col, Row, ControlLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';

import validator from 'email-validator';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Signup from './Signup';
import ResponsiveInputField from './ResponsiveInputField';
import { loginUser, forgotPasswordRequest, clearForgotEmail } from '../../utils/actions';
import SocialMediaLogin from './SocialMediaLogin';

const loginMessages = defineMessages({
  signupEmail: {
    id: 'Signup.email',
    defaultMessage: 'Email',
  },
  signupPassword: {
    id: 'Signup.password',
    defaultMessage: 'Password',
  },
  // signupLogin: {
  //   id: 'Signup.login',
  //   defaultMessage: 'Login',
  // },
  // signupForgotPassword: {
  //   id: 'Signup.forgotpassword',
  //   defaultMessage: 'Forgot Password?',
  // },
  // signupNoAccount: {
  //   id: 'Signup.noaccount',
  //   defaultMessage: 'Don&apos;t have an account?',
  // },
  // signupSignup: {
  //   id: 'Signup.signup',
  //   defaultMessage: 'Signup',
  // },
  confirmExchange: {
    id: 'Complete.confirmexchange',
    defaultMessage: 'Confirm exchange',
  },
});


class Login extends Signup {
  render() {
    const response = this.props.response;
    const { emailText, password } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div className="content-page login-page">
        <Helmet>
          <title>Login</title>
        </Helmet>
        <div className="page-header"><h3>Login</h3></div>
        <div>
          {response &&
            <Alert bsStyle="danger">
              <p>{response.message}</p>
            </Alert>
            // HIER aa.js wieder einfügen
          }
          <ResponsiveInputField
            formControlType="email"
            formControlValue={emailText}
            formControlPlaceHolder="Email"
            formControlOnChange={(e) => { this.onChange(e, 'emailText'); }}
            messageText={formatMessage(loginMessages.signupEmail)}
          />
          <ResponsiveInputField
            formControlType="password"
            formControlValue={password}
            formControlPlaceHolder="Password"
            formControlOnChange={(e) => { this.onChange(e, 'password'); }}
            messageText={formatMessage(loginMessages.signupPassword)}
          />
          <FormGroup>
            <div className="form-offset">
              <Button
                className="login-button"
                bsStyle="primary"
                onClick={() => this.props.loginUser({
                  endpoint: '/api/login',
                  data: {
                    email: emailText,
                    password,
                  }
                })}
              >
                <FormattedMessage
                  id={'Signup.login'}
                  defaultMessage={'Login'}
                />
              </Button>
              <Link
                className="forgot-link"
                to="/forgot"
              >
                <FormattedMessage
                  id={'Signup.forgotpassword'}
                  defaultMessage={'Forgot password?'}
                />
              </Link>
            </div>
          </FormGroup>
          <FormGroup>
            <div className="form-offset">
              <FormattedMessage
                id={'Signup.noaccount'}
                defaultMessage={"Don't have an account?"}
              />
              <Link className="sign-up-link" to="/signup">
                <FormattedMessage
                  id={'Signup.signup'}
                  defaultMessage={'Sign up'}
                />
              </Link>
            </div>
          </FormGroup>
          <SocialMediaLogin
            className="form-offset"
            responseGoogle={this.responseGoogle}
            responseFacebook={this.responseFacebook}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    isAuthenticated: auth.isAuthenticated,
    response: auth.loginResponse,
    forgotEmail: auth.forgotEmail,
  };
}


exports.Login = connect(mapStateToProps, { loginUser, push })(injectIntl(Login));
