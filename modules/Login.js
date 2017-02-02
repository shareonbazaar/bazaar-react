import React, { PropTypes as T } from 'react'
import { connect } from 'react-redux'
import { loginUser } from '../utils/actions'

import { Button, Modal, ControlLabel, FormGroup, FormControl } from 'react-bootstrap';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { push } from 'react-router-redux'


export class Login extends React.Component {
  constructor (props) {
    super(props)
    console.log("constructing login")
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
      <div>
        <h3>Sign in</h3>
        <FormGroup>
          <ControlLabel>Email</ControlLabel>
          <FormControl type="text" value={this.state.emailText} placeholder="Email" onChange={(e) => {this.onChange(e, 'emailText')}}/>
        </FormGroup>
        <FormGroup>
          <ControlLabel>Password</ControlLabel>
          <FormControl type="password" value={this.state.password} placeholder="Password" onChange={(e) => {this.onChange(e, 'password')}}/>
        </FormGroup>
          <GoogleLogin
            clientId="402876983916-k3pi2lsqh130r3a95o0rp1s3c2v0ugb2.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            fetchBasicProfile={true}
          />
          <FacebookLogin
            appId="542727669212147"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
          />,
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