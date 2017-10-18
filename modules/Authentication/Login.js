import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { push } from 'react-router-redux';
import { Button, FormGroup, Alert } from 'react-bootstrap';

import { FormattedMessage, injectIntl } from 'react-intl';
import ResponsiveInputField from './ResponsiveInputField';
import { loginUser, clearLoginAlert } from '../../utils/actions';
import SocialMediaLogin from './SocialMediaLogin';
import { loginMessages } from './messages';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      password: '',
    };
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthenticated) {
      const newLocation = this.props.location.state ? this.props.location.state.redirect : '/';
      this.props.push(newLocation);
    }
  }

  componentWillMount() {
    this.props.clearLoginAlert();
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

  renderLoginButton() {
    return (
      <FormGroup>
        <div className="form-offset">
          <Button
            type="submit"
            className="login-button"
            bsStyle="primary"
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
    );
  }

  renderSignupButton() {
    return (
      <FormGroup>
        <div className="form-offset">
          <FormattedMessage
            id={'Signup.noaccount'}
            defaultMessage={"Don't have an account?"}
          />
          <Link className="sign-up-link" to="/onboarding">
            <FormattedMessage
              id={'Signup.signup'}
              defaultMessage={'Sign up'}
            />
          </Link>
        </div>
      </FormGroup>
    );
  }

  render() {
    const { response } = this.props;
    const { emailText, password } = this.state;
    const { formatMessage } = this.props.intl;
    return (
      <div className="content-page login-page">
        <Helmet>
          <title>Login</title>
        </Helmet>
        <div className="page-header"><h3>Login</h3></div>
        <form onSubmit={(e) => {
          this.props.loginUser({
            endpoint: '/api/login',
            data: {
              email: emailText,
              password,
            }
          });
          e.preventDefault();
        }}
        >
          {response &&
            <Alert bsStyle="danger">
              <p>{response.message}</p>
            </Alert>
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
          {this.renderLoginButton()}
          {this.renderSignupButton()}
          <SocialMediaLogin
            className="form-offset"
            responseGoogle={this.responseGoogle}
            responseFacebook={this.responseFacebook}
          />
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool,
  location: PropTypes.object,
  push: PropTypes.func.isRequired,
  response: PropTypes.object,
  intl: PropTypes.object,
  loginUser: PropTypes.func.isRequired,
  clearLoginAlert: PropTypes.func.isRequired,
};
Login.defaultProps = {
  isAuthenticated: false,
  location: null,
  response: null,
  intl: null,
};

function mapStateToProps({ auth }) {
  return {
    isAuthenticated: auth.isAuthenticated,
    response: auth.loginResponse,
    forgotEmail: auth.forgotEmail,
  };
}


export default connect(mapStateToProps, { loginUser, push, clearLoginAlert })(injectIntl(Login));
