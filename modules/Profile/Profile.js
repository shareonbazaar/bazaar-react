import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { FormattedMessage } from 'react-intl';
import { Button, Grid, Row, Col } from 'react-bootstrap';
import { loadProfile } from '../../utils/actions';
import { SkillLabel, SkillLabelContainer } from '../EditProfile/SkillLabel';

import RequestButton from '../RequestButton/RequestButton';
import Review from '../Review/Review';


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
      return (
        <div>
          <FormattedMessage
            id={'Profile.loading'}
            defaultMessage={'Loading...'}
          />
        </div>
      );
    }
    return (
      <div className="user-profile content-page">
        <Grid fluid>
          <Row>
            <Col md={12} className="info-box">
              <div className="box">
                <div className="circular-img profile-pic">
                  <img alt="" src={profiledUser.picture} />
                </div>
                <div className="bio">
                  <h3>{profiledUser.name}</h3>
                  <div className="place">{profiledUser.hometown}</div>
                  <div className="place">{profiledUser.location}</div>
                  <div className="place">
                    <FormattedMessage
                      id={'Profile.membersince'}
                      defaultMessage={'Member since {createdAt}'}
                      values={{ createdAt: moment(profiledUser.createdAt).format('MMM YYYY') }}
                    />
                  </div>
                  <div className="place">
                    <FormattedMessage
                      id={'Profile.skillstoshare'}
                      defaultMessage={'{numSkills} skills to share with you'}
                      values={{ numSkills: profiledUser.skills.length }}
                    />
                  </div>
                </div>
                <h4>
                  <FormattedMessage
                    id={'Profile.aboutme'}
                    defaultMessage={'About Me'}
                  />
                </h4>
                <p>{profiledUser.aboutMe}</p>
              </div>
              {
                profiledUser._id === loggedInUser._id ? (
                  <Button onClick={() => this.props.push('/editprofile')} bsStyle="primary" bsSize="large" block>
                    <FormattedMessage
                      id={'Profile.editprofile'}
                      defaultMessage={'Edit Profile'}
                    />
                  </Button>
                ) : (
                  <RequestButton user={profiledUser} />
                )
              }
            </Col>
          </Row>
          <Row>
            <Col md={12} className="info-box">
              <div className="skills-box">
                <div className="box">
                  <h4>
                    <FormattedMessage
                      id={'Profile.icanoffer'}
                      defaultMessage={'I can offer'}
                    />
                  </h4>
                  <SkillLabelContainer
                    isInterestFunc={() => false}
                    isSelectedFunc={() => true}
                    skills={profiledUser.skills}
                  />
                </div>
              </div>
              <div className="skills-box">
                <div className="box">
                  <h4>
                    <FormattedMessage
                      id={'Profile.iaminterestedin'}
                      defaultMessage={'I am interested in'}
                    />
                  </h4>
                  <SkillLabelContainer
                    isInterestFunc={() => true}
                    isSelectedFunc={() => true}
                    skills={profiledUser.interests}
                  />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <div className="box">
                <h3>
                  <FormattedMessage
                    id={'Profile.reviews'}
                    defaultMessage={'Reviews'}
                  />
                </h3>
                {
                  profiledUser.reviews.length === 0 ?
                    <div className="empty-card-grid">
                      <p>
                        <FormattedMessage
                          id={'Profile.emptyReviews'}
                          defaultMessage={'No reviews here yet'}
                        />
                      </p>
                    </div>
                    :
                    profiledUser.reviews.map((review, i) =>
                      (<Review
                        key={i}
                        imageUrl={review._creator.profile.picture}
                        name={review._creator.profile.name.split(' ')[0]}
                        service={review._transaction.service.label.en}
                        text={review.text}
                        createdAt={review.createdAt}
                        rating={review.rating}
                      />))
                }
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
  params: PropTypes.object,
  profiledUser: PropTypes.object,
  loggedInUser: PropTypes.object,
  push: PropTypes.func,
};

Profile.defaultProps = {
  loadProfile: () => {},
  params: {},
  profiledUser: {},
  loggedInUser: {},
  push: () => {},
};


function mapStateToProps(state) {
  return {
    profiledUser: state.userProfile.user,
    loggedInUser: state.auth.user,
  };
}

export default connect(mapStateToProps, { loadProfile, push })(Profile);
