import React from 'react';
import PropTypes from 'prop-types';
import RequestButton from './RequestButton';

export default class UserCard extends React.Component {
  renderDiv(skill, i) {
    return (<div key={i} className="skill-label">{skill.label.en}</div>);
  }

  render() {
    const { user, bookmarked } = this.props;
    const imageStyle = {
      backgroundImage: `url('${user.picture}')`,
    };
    return (
      <div className="user-card grid-item">
        { /* eslint-disable */ }
        <img
          alt=""
          onClick={this.props.onBookmarkClicked}
          className="bookmark"
          src={`/images/bookmark_${bookmarked ? 'active.svg' : 'inactive.svg'}`}
        />
      { /* eslint-ensable */ }
        <div className="profile-info">
          <div className="profile-pic" style={imageStyle} />
          <div className="name-location">
            <h3>{user.name.split(' ')[0]}</h3>
            <h4>{user.location}</h4>
          </div>
          <hr className="separator" />
          <div className="skill-icons">
            {user.skills.map((skill, i) => this.renderDiv(skill, i))}
          </div>
        </div>
        <RequestButton user={user} />
      </div>
    );
  }
}

UserCard.propTypes = {
  user: PropTypes.node,
  onBookmarkClicked: PropTypes.func,
  bookmarked: PropTypes.bool,
};

UserCard.defaultProps = {
  user: null,
  onBookmarkClicked: () => {},
  bookmarked: false,
};
