import React from 'react';
import PropTypes from 'prop-types';
import RequestButton from './RequestButton';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

class UserCard extends React.Component {
  render () {
    const { user, bookmarked, onBookmarkClicked } = this.props;
    const imageStyle = {
      backgroundImage: 'url(' + user.picture +  ')',
    }
    return (
      <div className='user-card grid-item'>
        <img 
          onClick={onBookmarkClicked}
          className='bookmark'
          src={`/images/bookmark_${bookmarked ? 'active.svg' : 'inactive.svg'}`} />
        <div className='profile-info'>
          <div
            onClick={() => this.props.push(`/profile/${user._id}`)}
            className='profile-pic'
            style={imageStyle} >
          </div>
          <div className='name-location'>
            <h3>{user.name.split(' ')[0]}</h3>
            <h4>{user.location}</h4>
          </div>
          <hr className='separator' />
          <div className='skill-icons'>
            {user.skills.map((skill, i) => {
              return (
                <div key={i} className='skill-label'>{skill.label.en}</div>
              );
            })}
          </div>
        </div>
        <RequestButton user={user} />
      </div>
    )
  }
}

UserCard.propTypes = {
  user: PropTypes.object,
  onBookmarkClicked: PropTypes.func,
  bookmarked: PropTypes.bool,
};

UserCard.defaultProps = {
  user: {},
  onBookmarkClicked: () => {},
  bookmarked: false,
};

export default connect(null, { push })(UserCard);
