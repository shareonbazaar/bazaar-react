import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import validator from 'email-validator';
import { Button, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { updateProfile, deleteAccount } from '../utils/actions';
import ConfirmationModal from './ConfirmationModal';

const deleteMessage = 'You can delete your account, but keep in mind that this action is irreversible';
class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      hasClickedSubmit: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  render() {
    const response = this.props;
    const passwordValid = (this.state.password.length > 0 && this.state.password === this.state.confirmPassword);
    const onSubmitClicked = () => {
      this.setState({ hasClickedSubmit: true });
      if (passwordValid) {
        this.props.updateProfile(this.state);
      }
    };
    return (
      <div className="content-page settings-page">
        <div className="page-header"><h3>Change Password</h3></div>
        <div>
          {response &&
            <Alert
              bsStyle={`${response.type === 'error' ? 'danger' : 'success'}`}
              onDismiss={this.props.clearContactAlert}
            >
              <p>{response.message}</p>
            </Alert>
          }
          <FormGroup>
            <ControlLabel>New Password</ControlLabel>
            <FormControl type="password" value={this.state.password} onChange={(e) => { this.onChange(e, 'password'); }} />
          </FormGroup>
          <FormGroup validationState={(this.state.hasClickedSubmit && !passwordValid) ? 'error' : null}>
            <ControlLabel>Confirm Password</ControlLabel>
            <FormControl type="password" value={this.state.confirmPassword} onChange={(e) => { this.onChange(e, 'confirmPassword'); }} />
          </FormGroup>
          <hr />
          <FormGroup>
            <div className="save-button">
              <Button onClick={onSubmitClicked} bsStyle="primary">Change Password</Button>
            </div>
          </FormGroup>
        </div>
        <div className="page-header"><h3>Delete Account</h3></div>
        <p>{deleteMessage}</p>
        <ConfirmationModal
          onConfirmation={this.props.deleteAccount}
          title="Really delete?"
          buttonText="Delete my account"
          cancelStyle="default"
          confirmStyle="danger"
          buttonStyle="danger"
        />
      </div>
    );
  }
}
Settings.propTypes = {
  updateProfile: PropTypes.func,
  response: PropTypes.node,
  clearContactAlert: PropTypes.func,
  deleteAccount: PropTypes.func,
};

Settings.defaultProps = {
  updateProfile: () => {},
  response: null,
  clearContactAlert: () => {},
  deleteAccount: () => {},
};
//eslint-disable-next-line
const mapStateToProps = ({ auth }) => {
  return { loggedInUser: auth.user };
};

export default connect(mapStateToProps, { updateProfile, deleteAccount })(Settings);
