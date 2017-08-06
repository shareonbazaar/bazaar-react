import { Button, Grid, Col, Row, ControlLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import validator from 'email-validator';
import { push } from 'react-router-redux';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { loginUser } from '../utils/actions';

function SocialMediaLogin(props) {
  return (
    <FormGroup>
      <div className={props.className}>
        <FacebookLogin
          appId="542727669212147"
          autoLoad={false}
          fields="name,email,picture"
          callback={props.responseFacebook}
          icon="fa-facebook"
          textButton="Sign in with Facebook"
          cssClass="social-media-buttons facebook-login"
        />
        <GoogleLogin
          clientId="402876983916-k3pi2lsqh130r3a95o0rp1s3c2v0ugb2.apps.googleusercontent.com"
          buttonText="Sign in with Google"
          onSuccess={props.responseGoogle}
          onFailure={props.responseGoogle}
          fetchBasicProfile
          className="social-media-buttons google-login"
        >
          <i className="fa fa-google" />
          <span>Sign in with Google</span>
        </GoogleLogin>
      </div>
    </FormGroup>
  );
}


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
    const { firstName, lastName, emailText, password, confirmPassword } = this.state;
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
    const errorMessage = this.props.errorMessage;
    const hasClickedSignup = this.state.hasClickedSignup;

    return (
      <div className="content-page signup-page">
        <div className="page-header">
          <h3>Sign Up</h3>
        </div>
        <Grid fluid>
          <Row>
            <Col md={7}>
              {errorMessage &&
                <Alert bsStyle="danger">
                  <p>{errorMessage}</p>
                </Alert>
              }
              <FormGroup
                validationState={(hasClickedSignup && !firstNameValid) ? 'error' : null}
              >
                <ControlLabel>First Name</ControlLabel>
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
                <ControlLabel>Last Name</ControlLabel>
                <FormControl
                  type="text"
                  value={lastName}
                  placeholder="Doe"
                  onChange={(e) => { this.onChange(e, 'lastName'); }}
                />
              </FormGroup>
              <FormGroup validationState={(hasClickedSignup && !emailValid) ? 'error' : null}>
                <ControlLabel>Email</ControlLabel>
                <FormControl
                  type="email"
                  value={emailText}
                  placeholder="Email"
                  onChange={(e) => { this.onChange(e, 'emailText'); }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
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
                <ControlLabel>Confirm Password</ControlLabel>
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
                  Signup
                  </Button>
                </div>
              </FormGroup>
              <FormGroup>
                <div className="form-offset">
                  Already have an account?
                  <Link className="sign-up-link" to="/login">Login</Link>
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

class Login extends Signup {
  render() {
    const errorMessage = this.props;
    const { emailText, password } = this.state;
    return (
      <div className="content-page login-page">
        <div className="page-header"><h3>Sign In</h3></div>
        <div>
          {errorMessage &&
            <Alert bsStyle="danger">
              <p>{errorMessage}</p>
            </Alert>
          }
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type="email"
              value={emailText}
              placeholder="Email"
              onChange={(e) => { this.onChange(e, 'emailText'); }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => { this.onChange(e, 'password'); }}
            />
          </FormGroup>
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
              Login
              </Button>
              <Link className="forgot-link" to="/forgot">Forgot password?</Link>
            </div>
          </FormGroup>
          <FormGroup>
            <div className="form-offset">
              Don&apos;t have an account?
              <Link className="sign-up-link" to="/signup">Sign up</Link>
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

// These props come from the application's
// state when it is started
// function mapStateToProps(state, ownProps) {
function mapStateToProps(state) {
  const { isAuthenticated, errorMessage } = state.auth;
  return {
    isAuthenticated,
    errorMessage,
  };
}

SocialMediaLogin.defaultProps = {
  className: '',
  responseFacebook: null,
  responseGoogle: null,
};

SocialMediaLogin.propTypes = {
  className: PropTypes.string,
  responseFacebook: PropTypes.node,
  responseGoogle: PropTypes.node,
};

Signup.defaultProps = {
  isAuthenticated: false,
  location: null,
  push: null,
  loginUser: null,
  errorMessage: '',
};

Signup.propTypes = {
  isAuthenticated: PropTypes.bool,
  location: PropTypes.node,
  push: PropTypes.func,
  loginUser: PropTypes.node,
  errorMessage: PropTypes.string,
};

exports.Signup = connect(mapStateToProps, { loginUser, push })(Signup);
exports.Login = connect(mapStateToProps, { loginUser, push })(Login);
