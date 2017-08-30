import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { loginUser, forgotPasswordRequest, clearForgotEmail } from '../../utils/actions';


class Forgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
    };
    this.onChange = this.onChange.bind(this);
  }
  componentDidMount() {
    if (this.props.params.id) {
      this.props.loginUser({
        endpoint: '/api/resetPassword',
        data: {
          resetToken: this.props.params.id,
        }
      });
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.isAuthenticated) {
      this.props.push('/settings');
    }
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  renderAlert() {
    const { response } = this.props;
    return (
      <div className="content-page forgot-page">
        {response ?
          <Alert bsStyle="danger">
            <p>{response.message}</p>
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
    );
  }
  renderSuccess() {
    const { forgotEmail } = this.props;
    return (
      <div>
        <p>
          <FormattedMessage
            id={'Forgot.sendreset'}
            defaultMessage={'If there is an account associated with {forgotEmail}, an email will be sent to that account with instructions on how to reset password'}
            values={{ forgotEmail }}
          />
        </p>
        <a onClick={this.props.clearForgotEmail}>
          <FormattedMessage
            id={'Forgot.resetanother'}
            defaultMessage={'Reset a different account'}
          />
        </a>
      </div>
    );
  }
  renderTextField() {
    const { emailText } = this.state;
    return (
      <div>
        <FormGroup>
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
          <div className="form-offset">
            <Button
              className="login-button"
              bsStyle="primary"
              onClick={() => this.props.forgotPasswordRequest(emailText)}
            >
              <FormattedMessage
                id={'Forgot.reset'}
                defaultMessage={'Reset'}
              />
            </Button>
          </div>
        </FormGroup>
      </div>
    );
  }
  render() {
    const { params, forgotEmail } = this.props;
    if (params.id) {
      this.renderAlert();
    }
    return (
      <div className="content-page forgot-page">
        <div className="page-header">
          <h3>
            <FormattedMessage
              id={'Forgot.forgotpassword'}
              defaultMessage={'Forgot Password'}
            />
          </h3>
        </div>
        {forgotEmail ? this.renderSuccess() : this.renderTextField()}
      </div>
    );
  }
}
Forgot.propTypes = {
  params: PropTypes.object,
  response: PropTypes.object,
  forgotEmail: PropTypes.string,
  forgotPasswordRequest: PropTypes.func,
  clearForgotEmail: PropTypes.func,
  push: PropTypes.func,
  loginUser: PropTypes.func,
};

Forgot.defaultProps = {
  params: null,
  response: null,
  forgotEmail: '',
  forgotPasswordRequest: () => {},
  clearForgotEmail: () => {},
  push: () => {},
  loginUser: () => {},
};

function mapStateToProps({ auth }) {
  return {
    isAuthenticated: auth.isAuthenticated,
    response: auth.loginResponse,
    forgotEmail: auth.forgotEmail,
  };
}

export default connect(mapStateToProps, { forgotPasswordRequest, clearForgotEmail, loginUser, push })(Forgot);
