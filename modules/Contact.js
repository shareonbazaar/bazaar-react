import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { submitContact, clearContactAlert } from '../utils/actions'
import { connect } from 'react-redux'
import validator from 'email-validator';
import { FormattedMessage } from 'react-intl';

class Contact extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            message: '',
            hasClickedSubmit: false,
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange (e, field) {
        this.setState({
          [field]: e.target.value,
        });
    }

    render () {
        let nameValid = this.state.name.length > 0;
        let emailValid = validator.validate(this.state.email);
        let messageValid = this.state.message.length > 0;
        const onSubmitClicked = () => {
          this.setState({hasClickedSubmit: true})
          if (nameValid && emailValid && messageValid) {
              this.props.submitContact(this.state);
          }
        }
        return (
          <div className='content-page contact-page'>
            <div className='page-header'>
              <h3>
                <FormattedMessage
                    id={'Contact.header'}
                    defaultMessage={'Contact Form'}
                />
              </h3>
            </div>
            <div>
              {this.props.response &&
                <Alert
                  bsStyle={`${this.props.response.type === 'error' ? 'danger' : 'success'}`}
                  onDismiss={this.props.clearContactAlert}
                >
                  <p>{this.props.response.message}</p>
                </Alert>
              }
              <FormGroup validationState={(this.state.hasClickedSubmit && !nameValid) ? 'error' : null}>
                <ControlLabel>
                  <FormattedMessage
                    id={'Contact.name'}
                    defaultMessage={'Your Name'}
                  />
                </ControlLabel>
                <FormControl type="name" value={this.state.name} placeholder="John Doe" onChange={(e) => {this.onChange(e, 'name')}}/>
              </FormGroup>
              <FormGroup validationState={(this.state.hasClickedSubmit && !emailValid) ? 'error' : null}>
                <ControlLabel>
                  <FormattedMessage
                    id={'Contact.email'}
                    defaultMessage={'Your Email'}
                  />
                </ControlLabel>
                <FormControl type="email" value={this.state.email} placeholder="Email" onChange={(e) => {this.onChange(e, 'email')}}/>
              </FormGroup>
              <FormGroup validationState={(this.state.hasClickedSubmit && !messageValid) ? 'error' : null}>
                <ControlLabel className='label-top'>
                  <FormattedMessage
                    id={'Contact.message'}
                    defaultMessage={'Your Message'}
                  />
                </ControlLabel>
                <FormControl
                    componentClass="textarea"
                    rows={7}
                    value={this.state.message}
                    placeholder="Enter text"
                    onChange={(e) => {this.onChange(e, 'message')}}
                />
              </FormGroup>
              <hr />
              <FormGroup>
                <div className='save-button'>
                    <Button onClick={onSubmitClicked} bsStyle='primary'>
                      <FormattedMessage
                        id={'Contact.submit'}
                        defaultMessage={'Submit'}
                      />
                    </Button>
                </div>
              </FormGroup>
            </div>
        </div>
        )
    }
}

const mapStateToProps = ({contact}) => {
    return {response: contact.response}
}

export default connect(mapStateToProps, {submitContact, clearContactAlert})(Contact);

