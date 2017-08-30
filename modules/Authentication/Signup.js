import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import validator from 'email-validator';

import { Button, Grid, Col, Row, Alert, FormGroup } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router';

import SocialMediaLogin from './SocialMediaLogin';
import { loginUser } from '../../utils/actions';
import { signupMessages } from './messages';
import ResponsiveInputField from './ResponsiveInputField';

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
  /*
Authentic
   */

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      const newLocation = this.props.location.state ? this.props.location.state.redirect : '/';
      this.props.push(newLocation);
    }
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  responseGoogle(response) {
    this.props.loginUser({
      endpoint: '/auth/google',
      data: {
        id_token: response.getAuthResponse().id_token,
      }
    });
  }

  responseFacebook(response) {
    this.props.loginUser({
      endpoint: '/auth/facebook',
      data: {
        access_token: response.accessToken,
      }
    });
  }
  renderHeader() {
    return (
      <div className="page-header">
        <h3>
          <FormattedMessage
            id={'Signup.signup'}
            defaultMessage={'Sign up'}
          />
        </h3>
      </div>
    );
  }
  renderLoginButton() {
    return (
      <FormGroup>
        <div className="form-offset">
          <FormattedMessage
            id={'Signup.alreadyhaveaccount'}
            defaultMessage={'Already have an account?'}
          />
          <Link
            className="sign-up-link"
            to="/login"
          >
            <FormattedMessage
              id={'Signup.login'}
              defaultMessage={'Login'}
            />
          </Link>
        </div>
      </FormGroup>
    );
  }
  renderSignupButton() {
    return (
      <FormGroup>
        <div className="form-offset">
          <Button
            className="login-button"
            bsStyle="primary"
            type="submit"
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
    const {
      firstName,
      lastName,
      emailText,
      password,
      confirmPassword,
      hasClickedSignup
    } = this.state;
    const { response } = this.props;
    const firstNameValid = firstName.length > 0;
    const lastNameValid = lastName.length > 0;
    const emailValid = validator.validate(emailText);
    const passwordsValid = (password.length > 0 && password === confirmPassword);
    const { formatMessage } = this.props.intl;
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
            confirmPassword,
          }
        });
      }
      e.preventDefault();
    };

    return (
      <div className="content-page signup-page">
        {this.renderHeader()}
        <Grid fluid>
          <Row>
            <Col md={7}>
              {response &&
                <Alert bsStyle="danger">
                  <p>{response.message}</p>
                </Alert>
              }
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
                <ResponsiveInputField
                  formGroupIsValid={(hasClickedSignup && !passwordsValid)}
                  formControlType="password"
                  formControlValue={confirmPassword}
                  formControlPlaceHolder="Password"
                  formControlOnChange={(e) => { this.onChange(e, 'confirmPassword'); }}
                  messageText={formatMessage(signupMessages.confirmPassword)}
                />
                <ResponsiveInputField>
                  {this.renderSignupButton()}
                </ResponsiveInputField>
                <ResponsiveInputField>
                  {this.renderLoginButton()}
                </ResponsiveInputField>
              </form>
            </Col>
            <Col md={5}>
              <SocialMediaLogin
                responseFacebook={this.responseFacebook}
                responseGoogle={this.responseGoogle}
              />
            </Col>
          </Row>
        </Grid>
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

function mapStateToProps({ auth }) {
  return {
    isAuthenticated: auth.isAuthenticated,
    response: auth.loginResponse,
    forgotEmail: auth.forgotEmail,
  };
}

export default connect(mapStateToProps, { loginUser, push })(injectIntl(Signup));
