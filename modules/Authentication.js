import React, { PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loginUser } from '../utils/actions'

import { Button, Grid, Col, Row, ControlLabel, FormGroup, FormControl, Alert } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

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
              textButton="Sign in with Facebook"
              cssClass='social-media-buttons facebook-login'
            />
            <GoogleLogin
              clientId="402876983916-k3pi2lsqh130r3a95o0rp1s3c2v0ugb2.apps.googleusercontent.com"
              buttonText="Sign in with Google"
              onSuccess={props.responseGoogle}
              onFailure={props.responseGoogle}
              fetchBasicProfile={true}
              className='social-media-buttons google-login'
            >
              <i className='fa fa-google'></i>
              <span>Sign in with Google</span>
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
      this.props.authenticatedRedirect(newLocation);
    }
  }

  responseGoogle (response) {
    this.props.onSocialLogin({
      endpoint: '/auth/google',
      data: {
        id_token: response.getAuthResponse().id_token,
      }
    })
  }

  responseFacebook (response) {
    this.props.onSocialLogin({
      endpoint: '/auth/facebook',
      data: {
        access_token: response.accessToken,
      }
    })
  }

  render() {
    return (
      <div className='content-page signup-page'>
        <div className='page-header'><h3>Sign Up</h3></div>

        <Grid fluid={true}>
          <Row>
            <Col md={7}>
              {this.props.errorMessage &&
                <Alert bsStyle='danger'>
                  <p>{this.props.errorMessage}</p>
                </Alert>
              }
              <FormGroup>
                <ControlLabel>First Name</ControlLabel>
                <FormControl type="text" value={this.state.firstName} placeholder="John" onChange={(e) => {this.onChange(e, 'firstName')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Last Name</ControlLabel>
                <FormControl type="text" value={this.state.lastName} placeholder="Doe" onChange={(e) => {this.onChange(e, 'lastName')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Email</ControlLabel>
                <FormControl type="email" value={this.state.emailText} placeholder="Email" onChange={(e) => {this.onChange(e, 'emailText')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Password</ControlLabel>
                <FormControl type="password" value={this.state.password} placeholder="Password" onChange={(e) => {this.onChange(e, 'password')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl type="password" value={this.state.confirmPassword} placeholder="Password" onChange={(e) => {this.onChange(e, 'confirmPassword')}}/>
              </FormGroup>
              <FormGroup>
                <div className='form-offset'>
                  <Button className='login-button' bsStyle='primary'>Signup</Button>
                </div>
              </FormGroup>
              <FormGroup>
                <div className='form-offset'>
                  Already have an account?
                  <Link className='sign-up-link' to='/login'>Login</Link>
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
        <div className='page-header'><h3>Sign In</h3></div>
        <div>
          {this.props.errorMessage &&
            <Alert bsStyle='danger'>
              <p>{this.props.errorMessage}</p>
            </Alert>
          }
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl type="email" value={this.state.emailText} placeholder="Email" onChange={(e) => {this.onChange(e, 'emailText')}}/>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Password</ControlLabel>
            <FormControl type="password" value={this.state.password} placeholder="Password" onChange={(e) => {this.onChange(e, 'password')}}/>
          </FormGroup>
          <FormGroup>
            <div className='form-offset'>
              <Button className='login-button' bsStyle='primary'>Login</Button>
              <Link className='forgot-link' to='/forgot'>Forgot password?</Link>
            </div>
          </FormGroup>
          <FormGroup>
            <div className='form-offset'>
              Don't have an account?
              <Link className='sign-up-link' to='/signup'>Sign up</Link>
            </div>
          </FormGroup>
          <SocialMediaLogin className='form-offset' responseGoogle={this.responseGoogle} responseFacebook={this.responseFacebook} />
        </div>
      </div>
    )
  }
}

// These props come from the application's
// state when it is started
function mapStateToProps(state, ownProps) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onSocialLogin: (data) => {
      dispatch(loginUser(data));
    },
    authenticatedRedirect: (nextLocation) => {
      dispatch(push(nextLocation));
    }
  }
}

exports.Signup = connect(mapStateToProps, mapDispatchToProps)(Signup);
exports.Login = connect(mapStateToProps, mapDispatchToProps)(Login);