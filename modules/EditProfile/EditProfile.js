import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { FormGroup, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import Autocomplete from 'react-google-autocomplete';

import SkillsModal from './SkillsModal';
import { updateProfile, clearProfileAlert } from '../../utils/actions';
import Radio from './Radio';
import UploadPhoto from './UploadPhoto';
import SkillLabel from './SkillLabel';
import { editProfileMessages } from './messages';
import ResponsiveInputField from '../Authentication/ResponsiveInputField';
import ActionButton from '../Actions/ActionButton';
import NewcomerStatus from '../Onboarding/NewcomerStatus';

function EditSkills(props) {
  const { skills, onSkillClick, messageText, isInterest } = props;
  return (
    <ResponsiveInputField
      messageText={messageText}
      customInput
    >
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
      >
        {
          skills.map(skill => (
            <SkillLabel
              key={skill._id}
              skill={skill}
              isInterest={isInterest}
              isSelected
              style={{ flexBasis: '48%', margin: '1% 0' }}
            />
          ))
        }
        <div style={{ flexBasis: '48%', margin: '1% 0' }}>
          <SkillsModal
            title={messageText}
            skills={skills}
            onSkillClick={onSkillClick}
            areInterests={isInterest}
          />
        </div>
      </div>
    </ResponsiveInputField>
  );
}

EditSkills.propTypes = {
  skills: PropTypes.array.isRequired,
  onSkillClick: PropTypes.func.isRequired,
  messageText: PropTypes.string.isRequired,
  isInterest: PropTypes.bool.isRequired,
};

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
    window.scrollTo(0, 0);
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
    this.props.push('/');
  }
  renderHeader() {
    return (
      <div className="page-header">
        <h3>
          <FormattedMessage
            id={'EditProfile.title'}
            defaultMessage={'Edit profile'}
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
          <UploadPhoto imageUrl={picture} onImageChange={this.onImageChange} />
          <ResponsiveInputField
            formControlValue={email}
            formControlType="email"
            formControlPlaceHolder="Email"
            formControlOnChange={(e) => { this.onChange(e, 'email'); }}
          />
          <ResponsiveInputField
            formControlValue={name}
            formControlType="name"
            formControlPlaceHolder="John Doe"
            formControlOnChange={(e) => { this.onChange(e, 'name'); }}
          />
          <ResponsiveInputField
            customInput
          >
            <Autocomplete
              className="form-control"
              defaultValue={location}
              onPlaceSelected={place => this.setState({ location: place.name })}
              placeholder="Location"
              types={[]}
            />
          </ResponsiveInputField>
          <ResponsiveInputField
            customInput
          >
            <Autocomplete
              className="form-control"
              defaultValue={hometown}
              onPlaceSelected={place => this.setState({ hometown: place.name })}
              placeholder="Hometown"
              types={[]}
            />
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
            customInput
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
          <EditSkills
            messageText={formatMessage(editProfileMessages.skills)}
            skills={skills}
            onSkillClick={(skill) => { this.onArrayChange('skills', skill); }}
            isInterest={false}
          />
          <EditSkills
            messageText={formatMessage(editProfileMessages.interests)}
            skills={interests}
            onSkillClick={(skill) => { this.onArrayChange('interests', skill); }}
            isInterest
          />
          <NewcomerStatus
            onNewcomerSelect={isNewcomer => this.setState({ status: isNewcomer ? 'newcomer' : 'local' })}
            isNewcomer={status === 'newcomer'}
          />
          <hr />
          <FormGroup>
            <div>
              <ActionButton
                onClick={this.onSubmit}
                block
              >
                <FormattedMessage
                  id={'EditProfile.savechanges'}
                  defaultMessage={'Save changes'}
                />
              </ActionButton>
            </div>
          </FormGroup>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth, categories }) {
  return {
    loggedInUser: auth.user,
    response: auth.profileUpdateResponse,
    categories: categories.items,
  };
}

EditProfile.propTypes = {
  loggedInUser: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
  clearProfileAlert: PropTypes.func.isRequired,
  response: PropTypes.object,
  intl: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
};
EditProfile.defaultProps = {
  response: null,
};

export default connect(mapStateToProps, { updateProfile, clearProfileAlert, push })(injectIntl(EditProfile));
