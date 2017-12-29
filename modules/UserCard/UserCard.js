import React from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import RequestButton from '../RequestButton/RequestButton';
import { SkillLabel, SkillLabelContainer } from '../EditProfile/SkillLabel';


//eslint-disable-next-line
class UserCard extends React.Component {

  renderSkill(skill, i) {
    return (
      <div key={i} className="skill-label offer">
        {skill.label.en}
      </div>
    );
  }

  render() {
    const { user, onBookmarkClicked, bookmarked } = this.props;
    const imageStyle = {
      backgroundImage: `url(${user.picture})`,
    };
    return (
      <div className="user-card grid-item">
        <div onClick={onBookmarkClicked}>
          <img
            alt=""
            className="bookmark"
            src={`/images/bookmark_${bookmarked ? 'active.svg' : 'inactive.svg'}`}
          />
        </div>
        <div className="profile-info">
          <div
            onClick={() => this.props.push(`/profile/${user._id}`)}
            className="profile-pic"
            style={imageStyle}
          />
          <div className="name-location">
            <h3>{user.name.split(' ')[0]}</h3>
            <h4>{user.location}</h4>
          </div>
          <hr className="separator" />
          <SkillLabelContainer
            isInterestFunc={() => false}
            isSelectedFunc={() => true}
            onClick={skill => this.setState({ selectedSkill: skill._id })}
            skills={user.skills}
          />
        </div>
        <RequestButton user={user} />
      </div>
    );
  }
}

UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  bookmarked: PropTypes.bool,
  onBookmarkClicked: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
};

UserCard.defaultProps = {
  bookmarked: false,
};

export default connect(null, { push })(UserCard);
