import React from 'react'
import { Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux'
import CircularImage from './CircularImage'
import SkillsModal from './SkillsModal'
import { updateProfile } from '../utils/actions'


function Radio (props) {
    var klass = `radio ${props.name === props.selected ? 'selected' : ''}`;
    return (
        <div onClick={props.onClick} name={props.name} className={klass}>
            <span>{props.label}</span>
        </div>
    )
}

function UploadPhoto (props) {
    return (
        <div className={props.className}>
            <CircularImage imageUrl={props.imageUrl} />
            <label className='upload-message' htmlFor='fileInput'> Update photo</label>
            <input id="fileInput" style={{display: 'none'}} type='file' onChange={props.onImageChange} />
        </div>
    )
}

function SkillLabel (props) {
    return <div className='skill-label'>{props.label}</div>
}

class EditProfile extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            email: this.props.loggedInUser.email,
            name: this.props.loggedInUser.profile.name,
            location: this.props.loggedInUser.profile.location,
            hometown: this.props.loggedInUser.profile.hometown,
            aboutMe: this.props.loggedInUser.aboutMe,
            gender: this.props.loggedInUser.profile.gender,
            status: this.props.loggedInUser.profile.status,
            skills: this.props.loggedInUser._skills,
            interests: this.props.loggedInUser._interests,
            picture: this.props.loggedInUser.profile.picture,
            file: null,
        }
        this.onChange = this.onChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
    }

    onChange (e, field) {
        this.setState({
          [field]: e.target.value,
        });
    }

    onImageChange (e) {
        if (e.target.files && e.target.files[0]) {
            e.preventDefault();

            let reader = new FileReader();
            let file = e.target.files[0];

            reader.onloadend = () => {
                this.setState({
                    file: file,
                    picture: reader.result
                });
            }
            reader.readAsDataURL(file)
        }
    }

    onArrayChange (name, selected) {
        var index;
        if (this.state[name].some((skill, i) => {
            index = i;
            return skill._id == selected._id;
        })) {
            // Use slice to make copy of array, then remove selected skill from it
            var newArr = this.state[name].slice();
            newArr.splice(index, 1);
            this.setState({
                [name]: newArr,
            })
        } else {
            this.setState({
                [name]: this.state[name].concat([selected]),
            })
        }
    }

    render () {
        return (
          <div className='content-page edit-profile-page'>
            <div className='page-header'><h3>Edit your profile</h3></div>
            <div>
              <FormGroup>
                <ControlLabel className='label-top'>Profile picture</ControlLabel>
                <UploadPhoto className='user-activities' imageUrl={this.state.picture} onImageChange={this.onImageChange} />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Email</ControlLabel>
                <FormControl type="email" value={this.state.email} placeholder="Email" onChange={(e) => {this.onChange(e, 'email')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl type="name" value={this.state.name} placeholder="John Doe" onChange={(e) => {this.onChange(e, 'name')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Gender</ControlLabel>
                <div className='radio-block'>
                    {
                        [
                            {name: 'male', label: 'Male'},
                            {name: 'female', label: 'Female'},
                            {name: 'other', label: 'Other'}
                        ].map((props, i) => (
                                <Radio
                                    key={i}
                                    selected={this.state.gender}
                                    name={props.name} 
                                    onClick={() => this.setState({gender: props.name})} 
                                    label={props.label} />
                                ))
                    }
                </div>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Location</ControlLabel>
                <FormControl type="name" value={this.state.location} placeholder="Location" onChange={(e) => {this.onChange(e, 'location')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Hometown</ControlLabel>
                <FormControl type="name" value={this.state.hometown} placeholder="Hometown" onChange={(e) => {this.onChange(e, 'hometown')}}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>Status</ControlLabel>
                <div className='radio-block'>
                    {
                        [
                            {name: 'local', label: 'Local'},
                            {name: 'newcomer', label: 'Newcomer'}
                        ].map((props, i) => (
                                <Radio
                                    key={i}
                                    selected={this.state.status}
                                    name={props.name}
                                    onClick={() => this.setState({status: props.name})}
                                    label={props.label} />
                                ))
                    }
                </div>
              </FormGroup>
              <FormGroup>
                <ControlLabel className='label-top'>About Me</ControlLabel>
                <FormControl
                    componentClass="textarea"
                    value={this.state.aboutMe}
                    placeholder="Enter text"
                    onChange={(e) => {this.onChange(e, 'aboutMe')}}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel className='label-top'>Skills</ControlLabel>
                <div className='user-activities'>
                    <ul>
                        {
                            this.state.skills.map((skill, i) => {
                                return (
                                    <SkillLabel
                                        key={skill._id}
                                        label={skill.label.en}
                                    />
                                )
                            })
                        }
                    </ul>
                    <SkillsModal
                        title="Skills"
                        skills={this.state.skills.map(s => s._id)}
                        categories={[{label: {en: 'Sports' }, _id: 2, _skills: [{label: {en: 'Football'}, _id: 1}]}]}
                        onSkillClick={(skill) => {this.onArrayChange('skills', skill)}} />
                </div>
              </FormGroup>
              <FormGroup>
                <ControlLabel className='label-top'>Interests</ControlLabel>
                <div className='user-activities'>
                    <ul>
                        {
                            this.state.interests.map((skill, i) => {
                                return (
                                    <SkillLabel
                                        key={skill._id}
                                        label={skill.label.en}
                                    />
                                )
                            })
                        }
                    </ul>
                    <SkillsModal
                        title="Interests"
                        skills={this.state.interests.map(s => s._id)}
                        categories={[{label: {en: 'Sports' }, _id: 2, _skills: [{label: {en: 'Football'}, _id: 1}]}]}
                        onSkillClick={(skill) => {this.onArrayChange('interests', skill)}} />
                </div>
              </FormGroup>
              <hr />
              <FormGroup>
                <div className='save-button'>
                    <Button onClick={() => this.props.submitChanges(this.state)} bsStyle='primary'>Save changes</Button>
                </div>
              </FormGroup>
            </div>
        </div>
        )
    }
}

function mapDispatchToProps (dispatch) {
  return {
    submitChanges: (state) => {
        let form = new FormData();
        form.append('profile.name', state.name)
        form.append('profile.gender', state.gender)
        form.append('profile.hometown', state.hometown)
        form.append('profile.location', state.location)
        form.append('profile.status', state.status)
        form.append('aboutMe', state.aboutMe)
        form.append('_skills', JSON.stringify(state.skills.map(s => s._id)))
        form.append('_interests', JSON.stringify(state.interests.map(s => s._id)))
        if (state.file) {
            console.log("adding pic")
            form.append('profilepic', state.file)
        }
        dispatch(updateProfile(form));
    },
  }
}

// These props come from the application's
// state when it is started
function mapStateToProps(state, ownProps) {
    return {
        loggedInUser: state.auth.user,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);