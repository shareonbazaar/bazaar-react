import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Button, FormGroup, FormControl, ControlLabel, Alert } from 'react-bootstrap';
import { connect } from 'react-redux';
import CircularImage from '../CircularImage/CircularImage';
import SkillsModal from '../SkillsModal/SkillsModal';
import { updateProfile, clearProfileAlert } from '../../utils/actions';


const messages = defineMessages({
  male: {
    id: 'EditProfile.male',
    defaultMessage: 'Male',
  },
  female: {
    id: 'EditProfile.female',
    defaultMessage: 'Female',
  },
  other: {
    id: 'EditProfile.other',
    defaultMessage: 'Other',
  },
  local: {
    id: 'EditProfile.local',
    defaultMessage: 'Local',
  },
  newcomer: {
    id: 'EditProfile.newcomer',
    defaultMessage: 'Newcomer',
  },
});

function Radio(props) {
  const { name, selected, label, onClick } = props;
  const klass = `radio ${name === selected ? 'selected' : ''}`;
  return (
    <div onClick={onClick} name={name} className={klass}>
      <span>{label}</span>
    </div>
  );
}
Radio.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
};

Radio.defaultProps = {
  name: '',
  selected: '',
  label: '',
  onClick: () => {},
};

function UploadPhoto(props) {
  const { className, imageUrl, onImageChange } = props;
  return (
    <div className={className}>
      <CircularImage imageUrl={imageUrl} />
      <label className="upload-message" htmlFor="fileInput"> Update photo</label>
      <input id="fileInput" style={{ display: 'none' }} type="file" onChange={onImageChange} />
    </div>
  );
}

UploadPhoto.propTypes = {
  className: PropTypes.string,
  imageUrl: PropTypes.string,
  onImageChange: PropTypes.func,
};

UploadPhoto.defaultProps = {
  className: '',
  imageUrl: '',
  onImageChange: () => {},
};

function SkillLabel(props) {
  const { label } = props;
  return <div className="skill-label">{label}</div>;
}
SkillLabel.propTypes = {
  label: PropTypes.string,
};
SkillLabel.defaultProps = {
  label: '',
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

  render() {
    const { name, gender, email, picture, hometown, location, status, aboutMe, skills, interests } = this.state;
    const { response, intl } = this.props;
    const { formatMessage } = intl;
    return (
      <div className="content-page edit-profile-page">
        <div className="page-header">
          <h3>
            <FormattedMessage
              id={'EditProfile.title'}
              defaultMessage={'Edit your profile'}
            />
          </h3>
        </div>
        <div>
          {response &&
            <Alert
              bsStyle={`${response.type === 'error' ? 'danger' : 'success'}`}
              onDismiss={clearProfileAlert}
            >
              <p>{response.message}</p>
            </Alert>
          }
          <FormGroup>
            <ControlLabel className="label-top">
              <FormattedMessage
                id={'EditProfile.pic'}
                defaultMessage={'Profile picture'}
              />
            </ControlLabel>
            <UploadPhoto className="user-activities" imageUrl={picture} onImageChange={this.onImageChange} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                id={'Signup.email'}
                defaultMessage={'Email'}
              />
            </ControlLabel>
            <FormControl type="email" value={email} placeholder="Email" onChange={(e) => { this.onChange(e, 'email'); }} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                id={'EditProfile.name'}
                defaultMessage={'Name'}
              />
            </ControlLabel>
            <FormControl type="name" value={name} placeholder="John Doe" onChange={(e) => { this.onChange(e, 'name'); }} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                id={'EditProfile.gender'}
                defaultMessage={'Gender'}
              />
            </ControlLabel>
            <div className="radio-block">
              {
                [
                  { name: 'male', label: formatMessage(messages.male) },
                  { name: 'female', label: formatMessage(messages.female) },
                  { name: 'other', label: formatMessage(messages.other) }
                ].map((props, i) => (
                  <Radio
                    key={i}
                    selected={gender}
                    name={props.name}
                    onClick={() => this.setState({ gender: props.name })}
                    label={props.label}
                  />
                ))
              }
            </div>
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                id={'EditProfile.location'}
                defaultMessage={'Location'}
              />
            </ControlLabel>
            <FormControl
              type="name"
              value={location}
              placeholder="Location"
              onChange={(e) => { this.onChange(e, 'location'); }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                id={'EditProfile.hometown'}
                defaultMessage={'Hometown'}
              />
            </ControlLabel>
            <FormControl
              type="name"
              value={hometown}
              placeholder="Hometown"
              onChange={(e) => { this.onChange(e, 'hometown'); }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage
                id={'EditProfile.status'}
                defaultMessage={'Status'}
              />
            </ControlLabel>
            <div className="radio-block">
              {
                [
                  { name: 'local', label: formatMessage(messages.local) },
                  { name: 'newcomer', label: formatMessage(messages.newcomer) }
                ].map((props, i) => (
                  <Radio
                    key={i}
                    selected={status}
                    name={props.name}
                    onClick={() => this.setState({ status: props.name })}
                    label={props.label}
                  />
                ))
              }
            </div>
          </FormGroup>
          <FormGroup>
            <ControlLabel className="label-top">
              <FormattedMessage
                id={'EditProfile.aboutme'}
                defaultMessage={'About Me'}
              />
            </ControlLabel>
            <FormControl
              componentClass="textarea"
              value={aboutMe}
              placeholder="Enter text"
              onChange={(e) => { this.onChange(e, 'aboutMe'); }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel className="label-top">
              <FormattedMessage
                id={'EditProfile.skills'}
                defaultMessage={'Skills'}
              />
            </ControlLabel>
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
          </FormGroup>
          <FormGroup>
            <ControlLabel className="label-top">
              <FormattedMessage
                id={'EditProfile.interests'}
                defaultMessage={'Interests'}
              />
            </ControlLabel>
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
          </FormGroup>
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
  response: PropTypes.object,
  intl: PropTypes.object,
};
EditProfile.defaultProps = {
  loggedInUser: null,
  submitChanges: () => {},
  updateProfile: () => {},
  response: null,
  intl: null,
};

export default connect(mapStateToProps, { updateProfile, clearProfileAlert })(injectIntl(EditProfile));
