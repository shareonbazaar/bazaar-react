import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { injectIntl } from 'react-intl';

import validator from 'email-validator';
import { Button, Grid, Col, Row, ControlLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import { defineMessages } from 'react-intl';
import { SocialMediaLogin } from './Authentication';
import { loginUser } from '../../utils/actions';


//eslint-disable-next-line
const signupMessages = defineMessages({
  signupSignup: {
    id: 'Signup.signup',
    defaultMessage: 'Sign up',
  },
  signupFirstName: {
    id: 'Signup.firstname',
    defaultMessage: 'First Name',
  },
  signupLastName: {
    id: 'Signup.lastname',
    defaultMessage: 'Last Name',
  },
  signupEmail: {
    id: 'Signup.email',
    defaultMessage: 'Email',
  },
  signupPassword: {
    id: 'Signup.password',
    defaultMessage: 'Password',
  },
  signupConfirmPassword: {
    id: 'Signup.confirmpassword',
    defaultMessage: 'Confirm password',
  },
  signupAlreadyHaveAccount: {
    id: 'Signup.alreadyhaveaccount',
    defaultMessage: 'Already have an account?',
  },
  signupLogin: {
    id: 'Signup.login',
    defaultMessage: 'Login',
  },
  signupForgotPassword: {
    id: 'Signup.forgotpassword',
    defaultMessage: 'Forgot Password?',
  },
  signupNoAccount: {
    id: 'Signup.noaccount',
    defaultMessage: 'Don&apos;t have an account?',
  },
  confirmExchange: {
    id: 'Complete.confirmexchange',
    defaultMessage: 'Confirm exchange',
  },
});

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

  render() {
    const { firstName, lastName, emailText, password, confirmPassword, hasClickedSignup } = this.state;
    const firstNameValid = firstName.length > 0;
    const lastNameValid = lastName.length > 0;
    const emailValid = validator.validate(emailText);
    const passwordsValid = (password.length > 0 && password === confirmPassword);

    const onSignupClicked = () => {
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
    };

    return (
      <div className="content-page signup-page">
        <div className="page-header">
          <h3>
            <FormattedMessage
              id={'Signup.signup'}
              defaultMessage={'Sign up'}
            />
          </h3>
        </div>

        <Grid fluid>
          <Row>
            <Col md={7}>
              {this.props.response &&
                <Alert bsStyle="danger">
                  <p>{this.props.response.message}</p>
                </Alert>
              }
              <FormGroup
                validationState={(hasClickedSignup && !firstNameValid) ? 'error' : null}
              >
                <ControlLabel>
                  <FormattedMessage
                    id={'Signup.firstname'}
                    defaultMessage={'First Name'}
                  />
                </ControlLabel>
                <FormControl
                  type="text"
                  value={firstName}
                  placeholder="John"
                  onChange={(e) => { this.onChange(e, 'firstName'); }}
                />
              </FormGroup>
              <FormGroup
                validationState={(hasClickedSignup && !lastNameValid) ? 'error' : null}
              >
                <ControlLabel>
                  <FormattedMessage
                    id={'Signup.lastname'}
                    defaultMessage={'Last Name'}
                  />
                </ControlLabel>
                <FormControl
                  type="text"
                  value={lastName}
                  placeholder="Doe"
                  onChange={(e) => { this.onChange(e, 'lastName'); }}
                />
              </FormGroup>
              <FormGroup
                validationState={(hasClickedSignup && !emailValid) ? 'error' : null}
              >
                <ControlLabel>
                  <FormattedMessage
                    id={'Signup.email'}
                    defaultMessage={'Email'}
                  />
                </ControlLabel>
                <FormControl
                  type="email"
                  value={emailText}
                  placeholder="Email"
                  onChange={(e) => { this.onChange(e, 'emailText'); }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage
                    id={'Signup.password'}
                    defaultMessage={'Password'}
                  />
                </ControlLabel>
                <FormControl
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => { this.onChange(e, 'password'); }}
                />
              </FormGroup>
              <FormGroup
                validationState={(hasClickedSignup && !passwordsValid) ? 'error' : null}
              >
                <ControlLabel>
                  <FormattedMessage
                    id={'Signup.confirmpassword'}
                    defaultMessage={'Confirm password'}
                  />
                </ControlLabel>
                <FormControl
                  type="password"
                  value={confirmPassword}
                  placeholder="Password"
                  onChange={(e) => { this.onChange(e, 'confirmPassword'); }}
                />
              </FormGroup>
              <FormGroup>
                <div className="form-offset">
                  <Button
                    className="login-button"
                    bsStyle="primary"
                    onClick={onSignupClicked}
                  >
                    <FormattedMessage
                      id={'Signup.signup'}
                      defaultMessage={'Sign up'}
                    />
                  </Button>
                </div>
              </FormGroup>
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
function mapStateToProps({ auth }) {
  return {
    isAuthenticated: auth.isAuthenticated,
    response: auth.loginResponse,
    forgotEmail: auth.forgotEmail,
  };
}

Signup.defaultProps = {
  isAuthenticated: false,
  location: {},
  push: () => {},
  loginUser: () => {},
  response: {},
};

Signup.propTypes = {
  isAuthenticated: PropTypes.bool,
  location: PropTypes.object,
  push: PropTypes.func,
  loginUser: PropTypes.func,
  response: PropTypes.object,
};

export default connect(mapStateToProps, { loginUser, push })(Signup);
