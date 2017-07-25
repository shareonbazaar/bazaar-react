import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Helmet } from "react-helmet";
import { loginUser, forgotPasswordRequest, clearForgotEmail } from '../utils/actions'

import { Button, Grid, Col, Row, ControlLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import validator from 'email-validator';
import { FormattedMessage } from 'react-intl';

import { push } from 'react-router-redux'

function SocialMediaLogin (props) {
    return (
        <FormGroup>
          <div className={props.className}>
            <FacebookLogin
              appId="542727669212147"
              autoLoad={false}
              fields="name,email,picture"
              callback={props.responseFacebook}
              icon="fa-facebook"
              cssClass='social-media-buttons facebook-login'
            >
                <FormattedMessage
                    id={'Signup.loginwithFacebook'}
                    defaultMessage={'Login with Facebook'}
                />
            </FacebookLogin>
            <GoogleLogin
              clientId="402876983916-k3pi2lsqh130r3a95o0rp1s3c2v0ugb2.apps.googleusercontent.com"
              buttonText="Login with Google"
              onSuccess={props.responseGoogle}
              onFailure={props.responseGoogle}
              fetchBasicProfile={true}
              className='social-media-buttons google-login'
            >
              <i className='fa fa-google'></i>
              <span>
                  <FormattedMessage
                      id={'Signup.loginwithGoogle'}
                      defaultMessage={'Login with Google'}
                  />
              </span>
            </GoogleLogin>
          </div>
        </FormGroup>
  )
}


class Signup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailText: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      hasClickedSignup: false,
    }
    this.onChange = this.onChange.bind(this)
    this.responseGoogle = this.responseGoogle.bind(this)
    this.responseFacebook = this.responseFacebook.bind(this)
  }

  onChange (e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.isAuthenticated) {
      let newLocation = this.props.location.state ? this.props.location.state.redirect : '/'
      this.props.push(newLocation);
    }
  }

  responseGoogle (response) {
    this.props.loginUser({
      endpoint: '/auth/google',
      data: {
        id_token: response.getAuthResponse().id_token,
      }
    })
  }

  responseFacebook (response) {
    this.props.loginUser({
      endpoint: '/auth/facebook',
      data: {
        access_token: response.accessToken,
      }
    })
  }

  render() {
    let firstNameValid = this.state.firstName.length > 0;
    let lastNameValid = this.state.lastName.length > 0;
    let emailValid = validator.validate(this.state.emailText);
    let passwordsValid = (this.state.password.length > 0 && this.state.password == this.state.confirmPassword)
    const onSignupClicked = () => {
      this.setState({hasClickedSignup: true})
      if (firstNameValid && lastNameValid && emailValid && passwordsValid) {
          this.props.loginUser({
              endpoint: '/api/signup',
              data: {
                  firstName: this.state.firstName,
                  lastName: this.state.lastName,
                  email: this.state.emailText,
                  password: this.state.password,
                  confirmPassword: this.state.confirmPassword,
              }
          })
      }
    }
    return (
      <div className='content-page signup-page'>
        <div className='page-header'>
          <h3>
            <FormattedMessage
                id={'Signup.signup'}
                defaultMessage={'Sign up'}
            />
          </h3>
        </div>

        <Grid fluid={true}>
          <Row>
            <Col md={7}>
              {this.props.response &&
                <Alert bsStyle='danger'>
                  <p>{this.props.response.message}</p>
                </Alert>
              }
              <FormGroup validationState={(this.state.hasClickedSignup && !firstNameValid) ? 'error' : null}>
                <ControlLabel>
                  <FormattedMessage
                      id={'Signup.firstname'}
                      defaultMessage={'First Name'}
                  />
                </ControlLabel>
                <FormControl type="text" value={this.state.firstName} placeholder="John" onChange={(e) => {this.onChange(e, 'firstName')}}/>
              </FormGroup>
              <FormGroup validationState={(this.state.hasClickedSignup && !lastNameValid) ? 'error' : null}>
                <ControlLabel>
                  <FormattedMessage
                      id={'Signup.lastname'}
                      defaultMessage={'Last Name'}
                  />
                </ControlLabel>
                <FormControl type="text" value={this.state.lastName} placeholder="Doe" onChange={(e) => {this.onChange(e, 'lastName')}}/>
              </FormGroup>
              <FormGroup validationState={(this.state.hasClickedSignup && !emailValid) ? 'error' : null}>
                <ControlLabel>
                  <FormattedMessage
                      id={'Signup.email'}
                      defaultMessage={'Email'}
                  />
                </ControlLabel>
                <FormControl type="email" value={this.state.emailText} placeholder="Email" onChange={(e) => {this.onChange(e, 'emailText')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>
                  <FormattedMessage
                      id={'Signup.password'}
                      defaultMessage={'Password'}
                  />
                </ControlLabel>
                <FormControl type="password" value={this.state.password} placeholder="Password" onChange={(e) => {this.onChange(e, 'password')}}/>
              </FormGroup>
              <FormGroup validationState={(this.state.hasClickedSignup && !passwordsValid) ? 'error' : null}>
                <ControlLabel>
                  <FormattedMessage
                      id={'Signup.confirmpassword'}
                      defaultMessage={'Confirm password'}
                  />
                </ControlLabel>
                <FormControl type="password" value={this.state.confirmPassword} placeholder="Password" onChange={(e) => {this.onChange(e, 'confirmPassword')}}/>
              </FormGroup>
              <FormGroup>
                <div className='form-offset'>
                  <Button className='login-button' bsStyle='primary' onClick={onSignupClicked}>
                    <FormattedMessage
                        id={'Signup.signup'}
                        defaultMessage={'Sign up'}
                    />
                  </Button>
                </div>
              </FormGroup>
              <FormGroup>
                <div className='form-offset'>
                  <FormattedMessage
                      id={'Signup.alreadyhaveaccount'}
                      defaultMessage={'Already have an account?'}
                  />
                  <Link className='sign-up-link' to='/login'>
                    <FormattedMessage
                        id={'Signup.login'}
                        defaultMessage={'Login'}
                    />
                  </Link>
                </div>
              </FormGroup>
            </Col>
            <Col md={5}>
              <SocialMediaLogin responseFacebook={this.responseFacebook} responseGoogle={this.responseGoogle} />
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

class Login extends Signup {
  render () {
    return (
      <div className='content-page login-page'>
        <Helmet>
              <title>Login</title>
        </Helmet>
        <div className='page-header'><h3>Login</h3></div>
        <div>
          {this.props.response &&
            <Alert bsStyle='danger'>
              <p>{this.props.response.message}</p>
            </Alert>
          }
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                  id={'Signup.email'}
                  defaultMessage={'Email'}
              />
            </ControlLabel>
            <FormControl type="email" value={this.state.emailText} placeholder="Email" onChange={(e) => {this.onChange(e, 'emailText')}}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                  id={'Signup.password'}
                  defaultMessage={'Password'}
              />
            </ControlLabel>
            <FormControl type="password" value={this.state.password} placeholder="Password" onChange={(e) => {this.onChange(e, 'password')}}/>
          </FormGroup>
          <FormGroup>
            <div className='form-offset'>
              <Button
                className='login-button'
                bsStyle='primary'
                onClick={() => this.props.loginUser({
                    endpoint: '/api/login',
                    data: {
                        email: this.state.emailText,
                        password: this.state.password,
                    }
                })}>
                <FormattedMessage
                    id={'Signup.login'}
                    defaultMessage={'Login'}
                />
              </Button>
              <Link className='forgot-link' to='/forgot'>
                <FormattedMessage
                    id={'Signup.forgotpassword'}
                    defaultMessage={'Forgot password?'}
                />
              </Link>
            </div>
          </FormGroup>
          <FormGroup>
            <div className='form-offset'>
              <FormattedMessage
                  id={'Signup.noaccount'}
                  defaultMessage={"Don't have an account?"}
              />
              <Link className='sign-up-link' to='/signup'>
                <FormattedMessage
                    id={'Signup.signup'}
                    defaultMessage={"Sign up"}
                />
              </Link>
            </div>
          </FormGroup>
          <SocialMediaLogin className='form-offset' responseGoogle={this.responseGoogle} responseFacebook={this.responseFacebook} />
        </div>
      </div>
    )
  }
}

class Forgot extends Signup {
    componentDidMount () {
        if (this.props.params.id) {
            this.props.loginUser({
                endpoint: '/api/resetPassword',
                data: {
                    resetToken: this.props.params.id,
                }
            })
        }
    }

    componentWillReceiveProps (newProps) {
        if (newProps.isAuthenticated) {
            this.props.push('/settings');
        }
    }

    render () {
      if (this.props.params.id) {
          return (
              <div className='content-page forgot-page'>
                {this.props.response ?
                  <Alert bsStyle='danger'>
                    <p>{this.props.response.message}</p>
                  </Alert>
                  :
                  <div>
                    <FormattedMessage
                        id={'Signup.validatetoken'}
                        defaultMessage={'Validating token...'}
                    />
                  </div>
                }
              </div>
          )
      }
      return (
        <div className='content-page forgot-page'>
          <div className='page-header'>
            <h3>
              <FormattedMessage
                  id={'Forgot.forgotpassword'}
                  defaultMessage={"Forgot Password"}
              />
            </h3>
          </div>
          {
            this.props.forgotEmail ?

            <div>
              <p>
                <FormattedMessage
                  id={'Forgot.sendreset'}
                  defaultMessage={`If there is an account associated with {forgotEmail}, an email will be sent to that account with instructions on how to reset password`}
                  values={{forgotEmail: this.props.forgotEmail}}
                />
              </p>
              <a onClick={this.props.clearForgotEmail}>
                <FormattedMessage
                    id={'Forgot.resetanother'}
                    defaultMessage={"Reset a different account"}
                />
              </a>
            </div>

            :
            (
              <div>
                <FormGroup>
                  <ControlLabel>
                    <FormattedMessage
                        id={'Signup.email'}
                        defaultMessage={"Email"}
                    />
                  </ControlLabel>
                  <FormControl type="email" value={this.state.emailText} placeholder="Email" onChange={(e) => {this.onChange(e, 'emailText')}}/>
                </FormGroup>
                <FormGroup>
                  <div className='form-offset'>
                    <Button
                      className='login-button'
                      bsStyle='primary'
                      onClick={() => this.props.forgotPasswordRequest(this.state.emailText)}>
                      <FormattedMessage
                        id={'Forgot.reset'}
                        defaultMessage={"Reset"}
                      />
                    </Button>
                  </div>
                </FormGroup>
              </div>
            )
          }
        </div>
      )
    }
}

function mapStateToProps ({ auth }) {
  return {
    isAuthenticated: auth.isAuthenticated,
    response: auth.loginResponse,
    forgotEmail: auth.forgotEmail,
  }
}

exports.Signup = connect(mapStateToProps, {loginUser, push })(Signup);
exports.Login = connect(mapStateToProps, {loginUser, push })(Login);
exports.Forgot = connect(mapStateToProps, { forgotPasswordRequest, clearForgotEmail, loginUser, push })(Forgot)
