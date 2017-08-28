import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Helmet } from 'react-helmet';
import { push } from 'react-router-redux';
import { Button, FormGroup, Alert } from 'react-bootstrap';

import { FormattedMessage, injectIntl } from 'react-intl';
import ResponsiveInputField from './ResponsiveInputField';
import { loginUser } from '../../utils/actions';
import SocialMediaLogin from './SocialMediaLogin';
import { loginMessages } from './messages';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      password: '',
    };
  }

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

  renderLoginButton() {
    const { emailText, password } = this.state;
    return (
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
    );
  }

  renderSignupButton() {
    return (
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
        <div>
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
          <ResponsiveInputField>
            {this.renderLoginButton()}
          </ResponsiveInputField>
          <FormGroup>
            <ResponsiveInputField>
              {this.renderSignupButton()}
            </ResponsiveInputField>
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

Login.propTypes = {
  isAuthenticated: PropTypes.bool,
  location: PropTypes.object,
  push: PropTypes.func,
  response: PropTypes.object,
  intl: PropTypes.object,
  loginUser: PropTypes.func,
};
Login.defaultProps = {
  isAuthenticated: false,
  location: null,
  push: () => {},
  response: null,
  intl: null,
  loginUser: () => {},
};

function mapStateToProps({ auth }) {
  return {
    isAuthenticated: auth.isAuthenticated,
    response: auth.loginResponse,
    forgotEmail: auth.forgotEmail,
  };
}


export default connect(mapStateToProps, { loginUser, push })(injectIntl(Login));
