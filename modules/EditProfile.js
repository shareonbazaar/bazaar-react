import React from 'react';
import PropTypes from 'prop-types';
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import CircularImage from './CircularImage';
import SkillsModal from './SkillsModal';
import { updateProfile } from '../utils/actions';


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
  const { className, imageUrl } = props;
  return (
    <div className={className}>
      <CircularImage imageUrl={imageUrl} />
      <label className="upload-message" htmlFor="fileInput"> Update photo</label>
      <input id="fileInput" style={{ display: 'none' }} type="file" onChange={props.onImageChange} />
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
  const label = props;
  return <div className="skill-label">{label}</div>;
}

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

  render() {
    return (
      <div className="content-page edit-profile-page">
        <div className="page-header"><h3>Edit your profile</h3></div>
        <div>
          <FormGroup>
            <ControlLabel className="label-top">Profile picture</ControlLabel>
            <UploadPhoto className="user-activities" imageUrl={this.state.picture} onImageChange={this.onImageChange} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Email</ControlLabel>
            <FormControl type="email" value={this.state.email} placeholder="Email" onChange={(e) => { this.onChange(e, 'email'); }} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Name</ControlLabel>
            <FormControl type="name" value={this.state.name} placeholder="John Doe" onChange={(e) => { this.onChange(e, 'name'); }} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Gender</ControlLabel>
            <div className="radio-block">
              {
                [
                  { name: 'male', label: 'Male' },
                  { name: 'female', label: 'Female' },
                  { name: 'other', label: 'Other' }
                ].map((props, i) => (
                  <Radio
                    key={i}
                    selected={this.state.gender}
                    name={props.name}
                    onClick={() => this.setState({ gender: props.name })}
                    label={props.label}
                  />
                ))
              }
            </div>
          </FormGroup>
          <FormGroup>
            <ControlLabel>Location</ControlLabel>
            <FormControl type="name" value={this.state.location} placeholder="Location" onChange={(e) => { this.onChange(e, 'location'); }} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Hometown</ControlLabel>
            <FormControl type="name" value={this.state.hometown} placeholder="Hometown" onChange={(e) => { this.onChange(e, 'hometown'); }} />
          </FormGroup>
          <FormGroup>
            <ControlLabel>Status</ControlLabel>
            <div className="radio-block">
              {
                [
                  { name: 'local', label: 'Local' },
                  { name: 'newcomer', label: 'Newcomer' }
                ].map((props, i) => (
                  <Radio
                    key={i}
                    selected={this.state.status}
                    name={props.name}
                    onClick={() => this.setState({ status: props.name })}
                    label={props.label}
                  />
                ))
              }
            </div>
          </FormGroup>
          <FormGroup>
            <ControlLabel className="label-top">About Me</ControlLabel>
            <FormControl
              componentClass="textarea"
              value={this.state.aboutMe}
              placeholder="Enter text"
              onChange={(e) => { this.onChange(e, 'aboutMe'); }}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel className="label-top">Skills</ControlLabel>
            <div className="user-activities">
              <ul>
                {
                  //eslint-disable-next-line
                  this.state.skills.map((skill) => {
                    return (
                      <SkillLabel
                        key={skill._id}
                        label={skill.label.en}
                      />
                    );
                  }
                  )}
              </ul>
              <SkillsModal
                title="Skills"
                skills={this.state.skills.map(s => s._id)}
                onSkillClick={(skill) => { this.onArrayChange('skills', skill); }}
              />
            </div>
          </FormGroup>
          <FormGroup>
            <ControlLabel className="label-top">Interests</ControlLabel>
            <div className="user-activities">
              <ul>
                {
                  //eslint-disable-next-line
                  this.state.interests.map((skill, i) => {
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
                skills={this.state.interests.map(s => s._id)}
                onSkillClick={(skill) => { this.onArrayChange('interests', skill); }}
              />
            </div>
          </FormGroup>
          <hr />
          <FormGroup>
            <div className="save-button">
              <Button
                onClick={() => this.props.submitChanges(this.state)}
                bsStyle="primary"
              >
              Save changes
              </Button>
            </div>
          </FormGroup>
        </div>
      </div>
    );
  }
}

EditProfile.propTypes = {
  loggedInUser: PropTypes.node,
  submitChanges: PropTypes.func,
};

function mapDispatchToProps(dispatch) {
  return {
    submitChanges: (state) => {
      const form = new FormData();
      form.append('profile.name', state.name);
      form.append('profile.gender', state.gender);
      form.append('profile.hometown', state.hometown);
      form.append('profile.location', state.location);
      form.append('profile.status', state.status);
      form.append('aboutMe', state.aboutMe);

      // FormData won't let you send an empty array so we have to
      // fake it by sending an empty string and then checking for
      // that on client side
      if (state.skills.length === 0) {
        form.append('_skills', '');
      } else {
        //eslint-disable-next-line
        state.skills.forEach(s => form.append('_skills', s._id));
      }
      if (state.interests.length === 0) {
        form.append('_interests', '');
      } else {
        //eslint-disable-next-line
        state.interests.forEach(s => form.append('_interests', s._id))
      }
      if (state.file) {
        form.append('profilepic', state.file);
      }
      dispatch(updateProfile(form));
    },
  };
}

// These props come from the application's
// state when it is started
// function mapStateToProps(state, ownProps) {
function mapStateToProps(state) {
  return {
    loggedInUser: state.auth.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
