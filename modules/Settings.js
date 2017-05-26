import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel, Alert, Checkbox } from 'react-bootstrap';
import { updateProfile, deleteAccount, clearProfileAlert } from '../utils/actions'
import { connect } from 'react-redux'
import validator from 'email-validator';
import ConfirmationModal from './ConfirmationModal';


class Settings extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            hasClickedSubmit: false,
            acceptsEmails: Object.assign({}, this.props.loggedInUser.acceptsEmails),
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange (e, field) {
        this.setState({
          [field]: e.target.value,
        });
    }

    render () {
        let passwordValid = (this.state.password.length > 0 && this.state.password == this.state.confirmPassword)

        const onPasswordChange = () => {
          this.setState({hasClickedSubmit: true})
          if (passwordValid) {
              let form = new FormData();
              form.append('password', this.state.password)
              this.props.updateProfile(form);
          }
        }
        const onEmailsChange = () => {
          let form = new FormData();
          form.append('acceptsEmails.newExchanges', this.state.acceptsEmails.newExchanges)
          form.append('acceptsEmails.updateExchanges', this.state.acceptsEmails.updateExchanges)
          form.append('acceptsEmails.newMessages', this.state.acceptsEmails.newMessages)
          this.props.updateProfile(form);
        }
        return (
          <div className='content-page settings-page'>
            <div className='page-header'><h3>Change Password</h3></div>
            <div>
              {this.props.response &&
                <Alert
                  bsStyle={`${this.props.response.type === 'error' ? 'danger' : 'success'}`}
                  onDismiss={this.props.clearProfileAlert}
                >
                  <p>{this.props.response.message}</p>
                </Alert>
              }
              <FormGroup>
                <ControlLabel>New Password</ControlLabel>
                <FormControl type="password" value={this.state.password} onChange={(e) => {this.onChange(e, 'password')}}/>
              </FormGroup>
              <FormGroup validationState={(this.state.hasClickedSubmit && !passwordValid) ? 'error' : null}>
                <ControlLabel>Confirm Password</ControlLabel>
                <FormControl type="password" value={this.state.confirmPassword} onChange={(e) => {this.onChange(e, 'confirmPassword')}}/>
              </FormGroup>
              <hr />
              <FormGroup>
                <div className='save-button'>
                    <Button onClick={onPasswordChange} bsStyle='primary'>Change Password</Button>
                </div>
              </FormGroup>
            </div>
            <div className='page-header'><h3>Send me emails for:</h3></div>
            <FormGroup>
              <Checkbox
                onChange={() => this.setState({acceptsEmails: Object.assign({}, this.state.acceptsEmails, {
                  newExchanges: !this.state.acceptsEmails.newExchanges
                })})}
                checked={this.state.acceptsEmails.newExchanges}>
                New exchanges
              </Checkbox>
              <Checkbox
                onChange={() => this.setState({acceptsEmails: Object.assign({}, this.state.acceptsEmails, {
                  updateExchanges: !this.state.acceptsEmails.updateExchanges
                })})}
                checked={this.state.acceptsEmails.updateExchanges}>
                Updates to exchanges
              </Checkbox>
              <Checkbox
                onChange={() => this.setState({acceptsEmails: Object.assign({}, this.state.acceptsEmails, {
                  newMessages: !this.state.acceptsEmails.newMessages
                })})}
                checked={this.state.acceptsEmails.newMessages}>
                New chat messages
              </Checkbox>
            </FormGroup>
            <FormGroup>
              <div className='save-button'>
                  <Button onClick={onEmailsChange} bsStyle='primary'>Save preferences</Button>
              </div>
            </FormGroup>
            <div className='page-header'><h3>Delete Account</h3></div>
            <p>You can delete your account, but keep in mind that this action is irreversible</p>
            <ConfirmationModal 
                onConfirmation={this.props.deleteAccount}
                title='Really delete?'
                buttonText='Delete my account'
                cancelStyle='default'
                confirmStyle='danger'
                buttonStyle='danger'
            />
        </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return {
        loggedInUser: auth.user,
        response: auth.profileUpdateResponse
    }
}

export default connect(mapStateToProps, {updateProfile, deleteAccount, clearProfileAlert})(Settings);

