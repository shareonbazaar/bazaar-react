import React, { PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { loginUser } from '../utils/actions'

import { Button, Modal, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { push } from 'react-router-redux'


export class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailText: '',
      password: '',
    }
    this.onChange = this.onChange.bind(this)
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

  render() {
    const responseGoogle = (response) => {
      this.props.onSocialLogin({
        endpoint: '/auth/google',
        data: {
          id_token: response.getAuthResponse().id_token,
        }
      })
    }

    const responseFacebook = (response) => {
      this.props.onSocialLogin({
        endpoint: '/auth/facebook',
        data: {
          access_token: response.accessToken,
        }
      })
    }
    return (
      <div className='content-page form-page'>
        <div className='page-header'><h3>Sign In</h3></div>
        <div>
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
          <FormGroup>
            <div className='form-offset'>
              <FacebookLogin
                appId="542727669212147"
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
                icon="fa-facebook"
                textButton="Sign in with Facebook"
                cssClass='facebook-login'
              />
              <GoogleLogin
                clientId="402876983916-k3pi2lsqh130r3a95o0rp1s3c2v0ugb2.apps.googleusercontent.com"
                buttonText="Sign in with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                fetchBasicProfile={true}
                className='google-login'
              >
                <i className='fa fa-google'></i>
                <span>Sign in with Google</span>
              </GoogleLogin>
            </div>
          </FormGroup>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);