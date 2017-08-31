import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Button, FormGroup, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import SkillsModal from '../SkillsModal/SkillsModal';
import { updateProfile, clearProfileAlert } from '../../utils/actions';
import Radio from './Radio';
import UploadPhoto from './UploadPhoto';
import SkillLabel from './SkillLabel';
import { editProfileMessages } from './messages';
import ResponsiveInputField from '../Authentication/ResponsiveInputField';

class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    const { loggedInUser } = props;
    this.state = {
      email: loggedInUser.email,
      name: loggedInUser.profile.name,
      location: loggedInUser.profile.location,
      hometown: loggedInUser.profile.hometown,
      aboutMe: loggedInUser.aboutMe,
      gender: loggedInUser.profile.gender,
      status: loggedInUser.profile.status,
      //eslint-disable-next-line
      skills: loggedInUser._skills,
      //eslint-disable-next-line
      interests: loggedInUser._interests,
      picture: loggedInUser.profile.picture,
      file: null,
    };
    this.onChange = this.onChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.props.clearProfileAlert();
  }

  onChange(e, field) {
    this.setState({
      [field]: e.target.value,
    });
  }

  onImageChange(e) {
    if (e.target.files && e.target.files[0]) {
      e.preventDefault();
      const reader = new FileReader();
      const file = e.target.files[0];
      reader.onloadend = () => {
        this.setState({
          file,
          picture: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onArrayChange(name, selected) {
    let index;
    if (this.state[name].some((skill, i) => {
      index = i;
      //eslint-disable-next-line
      return skill._id === selected._id;
    })) {
      // Use slice to make copy of array, then remove selected skill from it
      const newArr = this.state[name].slice();
      newArr.splice(index, 1);
      this.setState({
        [name]: newArr,
      });
    } else {
      this.setState({
        [name]: this.state[name].concat([selected]),
      });
    }
  }

  onSubmit() {
    const { name, gender, hometown, location, status, aboutMe, skills, interests, file } = this.state;
    const form = new FormData();
    form.append('profile.name', name);
    form.append('profile.gender', gender);
    form.append('profile.hometown', hometown);
    form.append('profile.location', location);
    form.append('profile.status', status);
    form.append('aboutMe', aboutMe);

    // FormData won't let you send an empty array so we have to
    // fake it by sending an empty string and then checking for
    // that on client side
    if (skills.length === 0) {
      form.append('_skills', '');
    } else {
      skills.forEach(s => form.append('_skills', s._id));
    }

    if (interests.length === 0) {
      form.append('_interests', '');
    } else {
      interests.forEach(s => form.append('_interests', s._id));
    }

    if (file) {
      form.append('profilepic', file);
    }
    this.props.updateProfile(form);
  }
  renderHeader() {
    return (
      <div className="page-header">
        <h3>
          <FormattedMessage
            id={'EditProfile.title'}
            defaultMessage={'Edit your profile'}
          />
        </h3>
      </div>
    );
  }

  renderAlert() {
    const { response } = this.props;
    return (
      <Alert
        bsStyle={`${response.type === 'error' ? 'danger' : 'success'}`}
        onDismiss={this.props.clearProfileAlert}
      >
        <p>{response.message}</p>
      </Alert>
    );
  }
  render() {
    const { name, gender, email, picture, hometown, location, status, aboutMe, skills, interests } = this.state;
    const { response } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="content-page edit-profile-page">
        {this.renderHeader()}
        <div>
          {response && this.renderAlert()}
          <ResponsiveInputField
            renderChildren
            className="label-top"
            messageText={formatMessage(editProfileMessages.pic)}
          >
            <UploadPhoto className="user-activities" imageUrl={picture} onImageChange={this.onImageChange} />
          </ResponsiveInputField>
          <ResponsiveInputField
            formControlValue={email}
            formControlType="email"
            formControlPlaceHolder="Email"
            formControlOnChange={(e) => { this.onChange(e, 'email'); }}
            messageText={formatMessage(editProfileMessages.email)}
          />
          <ResponsiveInputField
            formControlValue={name}
            formControlType="name"
            formControlPlaceHolder="John Doe"
            formControlOnChange={(e) => { this.onChange(e, 'name'); }}
            messageText={formatMessage(editProfileMessages.name)}
          />
          <ResponsiveInputField
            renderChildren
            messageText={formatMessage(editProfileMessages.gender)}
          >
            <div className="radio-block">
              {
                [
                  { name: 'male', label: formatMessage(editProfileMessages.male) },
                  { name: 'female', label: formatMessage(editProfileMessages.female) },
                  { name: 'other', label: formatMessage(editProfileMessages.other) }
                ].map(props => (
                  <Radio
                    key={props.name}
                    selected={gender}
                    name={props.name}
                    onClick={() => this.setState({ gender: props.name })}
                    label={props.label}
                  />
                ))
              }
            </div>
          </ResponsiveInputField>
          <ResponsiveInputField
            formControlValue={location}
            formControlType="name"
            formControlPlaceHolder="Location"
            formControlOnChange={(e) => { this.onChange(e, 'location'); }}
            messageText={formatMessage(editProfileMessages.location)}
          />
          <ResponsiveInputField
            formControlValue={hometown}
            formControlType="name"
            formControlPlaceHolder="Hometown"
            formControlOnChange={(e) => { this.onChange(e, 'hometown'); }}
            messageText={formatMessage(editProfileMessages.hometown)}
          />
          <ResponsiveInputField
            renderChildren
            messageText={formatMessage(editProfileMessages.status)}
          >
            <div className="radio-block">
              {
                [
                  { name: 'local', label: formatMessage(editProfileMessages.local) },
                  { name: 'newcomer', label: formatMessage(editProfileMessages.newcomer) }
                ].map(props => (
                  <Radio
                    key={props.name}
                    selected={status}
                    name={props.name}
                    onClick={() => this.setState({ status: props.name })}
                    label={props.label}
                  />
                ))
              }
            </div>
          </ResponsiveInputField>
          <ResponsiveInputField
            formControlValue={aboutMe}
            formControlOnChange={(e) => { this.onChange(e, 'aboutMe'); }}
            className="label-top"
            messageText={formatMessage(editProfileMessages.aboutMe)}
            componentClass="textarea"
            rows={3}
            style={{ height: 100 }}
          />
          <ResponsiveInputField
            renderChildren
            className="label-top"
            messageText={formatMessage(editProfileMessages.skills)}
          >
            <div className="user-activities">
              <ul>
                {
                  // skills.map((skill, i) => (
                  skills.map(skill => (
                    <SkillLabel key={skill._id} label={skill.label.en} />
                  ))
                }
              </ul>
              <SkillsModal
                title="Skills"
                skills={skills.map(s => s._id)}
                onSkillClick={(skill) => { this.onArrayChange('skills', skill); }}
              />
            </div>
          </ResponsiveInputField>
          <ResponsiveInputField
            renderChildren
            className="label-top"
            messageText={formatMessage(editProfileMessages.interests)}
          >
            <div className="user-activities">
              <ul>
                {
                  // eslint-disable-next-line
                  interests.map((skill, i) => {
                    return (
                      <SkillLabel
                        key={skill._id}
                        label={skill.label.en}
                      />
                    );
                  })
                }
              </ul>
              <SkillsModal
                title="Interests"
                skills={interests.map(s => s._id)}
                onSkillClick={(skill) => { this.onArrayChange('interests', skill); }}
              />
            </div>
          </ResponsiveInputField>
          <hr />
          <FormGroup>
            <div className="save-button">
              <Button onClick={this.onSubmit} bsStyle="primary">
                <FormattedMessage
                  id={'EditProfile.savechanges'}
                  defaultMessage={'Save changes'}
                />
              </Button>
            </div>
          </FormGroup>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return {
    loggedInUser: auth.user,
    response: auth.profileUpdateResponse
  };
}

EditProfile.propTypes = {
  loggedInUser: PropTypes.object,
  submitChanges: PropTypes.func,
  updateProfile: PropTypes.func,
  clearProfileAlert: PropTypes.func,
  response: PropTypes.object,
  intl: PropTypes.object,
};
EditProfile.defaultProps = {
  loggedInUser: null,
  submitChanges: () => {},
  updateProfile: () => {},
  clearProfileAlert: () => {},
  response: null,
  intl: null,
};

export default connect(mapStateToProps, { updateProfile, clearProfileAlert })(injectIntl(EditProfile));
