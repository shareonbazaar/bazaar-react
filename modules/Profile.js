import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { loadProfile } from '../utils/actions';
import RequestButton from './RequestButton';
import Review from './Review';


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.props.loadProfile(props.params.id);
  }
  componentWillReceiveProps(newProps) {
    if (newProps.params.id !== this.props.params.id) {
      this.props.loadProfile(newProps.params.id);
    }
  }

  render() {
    const { profiledUser, loggedInUser } = this.props;
    if (Object.keys(profiledUser).length === 0) {
      return <div>Loading...</div>;
    }
    return (
      <div className="user-profile content-page">
        <Grid fluid>
          <Row>
            <Col md={12} className="info-box">
              <div className="box">
                <div className="circular-img profile-pic">
                  <img src={profiledUser.picture} alt="" />
                </div>
                <div className="bio">
                  <h3>{profiledUser.name}</h3>
                  <div className="place">{profiledUser.hometown}</div>
                  <div className="place">{profiledUser.location}</div>
                  <div className="place">Member since {moment(profiledUser.createdAt).format('MMM YYYY')}</div>
                  <div className="place">{profiledUser.skills.length} skills to share with you</div>
                </div>
                <h4>About Me</h4>
                <p>{profiledUser.aboutMe}</p>
              </div>
              {
                //eslint-disable-next-line
                profiledUser._id === loggedInUser._id ? (
                  <Button onClick={() => this.props.push('/editprofile')} bsStyle="primary" bsSize="large" block>Edit Profile</Button>
                ) : (
                  <RequestButton user={this.props.profiledUser} />
                )
              }
            </Col>
          </Row>
          <Row>
            <Col md={12} className="info-box">
              <div className="skills-box">
                <div className="box">
                  <h4>I can offer</h4>
                  {this.props.profiledUser.skills.map((skill, i) => <div className="skill-label" key={i}>{skill.label.en}</div>)}
                </div>
              </div>
              <div className="skills-box">
                <div className="box">
                  <h4>I am interested in</h4>
                  {this.props.profiledUser.interests.map((skill, i) => <div className="skill-label" key={i}>{skill.label.en}</div>)}
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="box">
                <h3>Reviews</h3>
                {this.props.profiledUser.reviews.map(review => <Review content={review} />)}
              </div>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Profile.propTypes = {
  loadProfile: PropTypes.func,
  params: PropTypes.node,
  profiledUser: PropTypes.node,
  loggedInUser: PropTypes.node,
  push: PropTypes.func,
};

Profile.defaultProps = {
  loadProfile: () => {},
  params: null,
  profiledUser: null,
  loggedInUser: null,
  push: () => {},
};


// These props come from the application's
// state when it is started
// function mapStateToProps(state, ownProps) {
function mapStateToProps(state) {
  return {
    profiledUser: state.userProfile.user,
    loggedInUser: state.auth.user,
  };
}

export default connect(mapStateToProps, { loadProfile, push })(Profile);
