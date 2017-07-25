import React from 'react'
import moment from 'moment'
import { Button, Modal, Grid, Row, Col } from 'react-bootstrap';
import { loadProfile } from '../utils/actions'
import { push } from 'react-router-redux'
import RequestButton from './RequestButton'
import Review from './Review'
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux'


class Profile extends React.Component {

    constructor (props) {
        super(props);
        this.props.loadProfile(props.params.id)
    }

    componentWillReceiveProps (newProps) {
        if (newProps.params.id !== this.props.params.id) {
            this.props.loadProfile(newProps.params.id);
        }
    }

    render () {
        if (Object.keys(this.props.profiledUser).length === 0) {
            return (
                <div>
                    <FormattedMessage
                      id={'Profile.loading'}
                      defaultMessage={'Loading...'}
                    />
                </div>
            )
        }
        return (
            <div className='user-profile content-page'>
                <Grid fluid={true}>
                    <Row>
                        <Col md={12} className='info-box'>
                            <div className='box'>
                                <div className='circular-img profile-pic'>
                                    <img src={this.props.profiledUser.picture} />
                                </div>
                                <div className='bio'>
                                    <h3>{this.props.profiledUser.name}</h3>
                                    <div className='place'>{this.props.profiledUser.hometown}</div>
                                    <div className='place'>{this.props.profiledUser.location}</div>
                                    <div className='place'>
                                        <FormattedMessage
                                          id={'Profile.membersince'}
                                          defaultMessage={'Member since {createdAt}'}
                                          values={{createdAt: moment(this.props.profiledUser.createdAt).format('MMM YYYY')}}
                                        />
                                    </div>
                                    <div className='place'>
                                        <FormattedMessage
                                          id={'Profile.skillstoshare'}
                                          defaultMessage={'{numSkills} skills to share with you'}
                                          values={{numSkills: this.props.profiledUser.skills.length}}
                                        />
                                    </div>
                                </div>
                                <h4>
                                    <FormattedMessage
                                      id={'EditProfile.aboutme'}
                                      defaultMessage={'About Me'}
                                    />
                                </h4>
                                <p>{this.props.profiledUser.aboutMe}</p>
                            </div>
                            {
                                this.props.profiledUser._id === this.props.loggedInUser._id ? (
                                    <Button onClick={() => this.props.push('/editprofile')} bsStyle="primary" bsSize="large" block>
                                        <FormattedMessage
                                            id={'Profile.editprofile'}
                                            defaultMessage={'Edit Profile'}
                                        />
                                    </Button>
                                ) : (
                                    <RequestButton user={this.props.profiledUser} />
                                )
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12} className='info-box'>
                            <div className='skills-box'>
                                <div className='box'>
                                    <h4>
                                        <FormattedMessage
                                            id={'Profile.icanoffer'}
                                            defaultMessage={'I can offer'}
                                        />
                                    </h4>
                                    {this.props.profiledUser.skills.map((skill, i) => <div className='skill-label' key={i}>{skill.label.en}</div>)}
                                </div>
                            </div>
                            <div className='skills-box'>
                                <div className='box'>
                                    <h4>
                                        <FormattedMessage
                                            id={'Profile.iaminterestedin'}
                                            defaultMessage={'I am interested in'}
                                        />
                                    </h4>
                                    {this.props.profiledUser.interests.map((skill, i) => <div className='skill-label' key={i}>{skill.label.en}</div>)}
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div className='box'>
                                <h3>
                                    <FormattedMessage
                                        id={'Profile.reviews'}
                                        defaultMessage={'Reviews'}
                                    />
                                </h3>
                                {
                                    this.props.profiledUser.reviews.map((review, i) =>
                                    <Review
                                        key={i}
                                        imageUrl={review._creator.profile.picture}
                                        name={review._creator.profile.name.split(' ')[0]}
                                        service={review._transaction.service.label.en}
                                        text={review.text}
                                        createdAt={review.createdAt}
                                        rating={review.rating}
                                    />)
                                }
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
    }
}


// These props come from the application's
// state when it is started
function mapStateToProps(state, ownProps) {
    return {
        profiledUser: state.userProfile.user,
        loggedInUser: state.auth.user,
    }
}

export default connect(mapStateToProps, { loadProfile, push })(Profile);
