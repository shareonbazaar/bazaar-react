import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import validator from 'email-validator';
import { Button, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { submitContact, clearContactAlert } from '../utils/actions';


class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      message: '',
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
    const nameValid = this.state.name.length > 0;
    const emailValid = validator.validate(this.state.email);
    const messageValid = this.state.message.length > 0;
    const response = this.props;

    const onSubmitClicked = () => {
      this.setState({ hasClickedSubmit: true });
      if (nameValid && emailValid && messageValid) {
        this.props.submitContact(this.state);
      }
    };

    return (
      <div className="content-page contact-page">
        <div className="page-header">
          <h3>Contact Form</h3>
        </div>
        <div>
          {response &&
            <Alert
              bsStyle={`${response.type === 'error' ? 'danger' : 'success'}`}
              onDismiss={this.props.clearContactAlert}
            >
              <p>{response.message}</p>
            </Alert>
          }
          <FormGroup validationState={(this.state.hasClickedSubmit && !nameValid) ? 'error' : null}>
            <ControlLabel>Your Name</ControlLabel>
            <FormControl
              type="name"
              value={this.state.name}
              placeholder="John Doe"
              onChange={(e) => { this.onChange(e, 'name'); }}
            />
          </FormGroup>
          <FormGroup validationState={(this.state.hasClickedSubmit && !emailValid) ? 'error' : null}>
            <ControlLabel>Your Email</ControlLabel>
            <FormControl
              type="email"
              value={this.state.email}
              placeholder="Email"
              onChange={(e) => { this.onChange(e, 'email'); }}
            />
          </FormGroup>
          <FormGroup validationState={(this.state.hasClickedSubmit && !messageValid) ? 'error' : null}>
            <ControlLabel className="label-top">Your Message</ControlLabel>
            <FormControl
              componentClass="textarea"
              rows={7}
              value={this.state.message}
              placeholder="Enter text"
              onChange={(e) => { this.onChange(e, 'message'); }}
            />
          </FormGroup>
          <hr />
          <FormGroup>
            <div className="save-button">
              <Button onClick={onSubmitClicked} bsStyle="primary">Submit</Button>
            </div>
          </FormGroup>
        </div>
      </div>
    );
  }
}
Contact.propTypes = {
  response: PropTypes.node,
  clearContactAlert: PropTypes.func,
  submitContact: PropTypes.func,
};

Contact.defaultProps = {
  response: null,
  clearContactAlert: () => {},
  submitContact: () => {},
};
const mapStateToProps = ({ contact }) => ({
  response: contact.response,
});

export default connect(mapStateToProps, { submitContact, clearContactAlert })(Contact);
