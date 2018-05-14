import React from 'react';
import PropTypes from 'prop-types';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import RequestButton from '../RequestButton/RequestButton';
import { SkillLabelContainer } from '../EditProfile/SkillLabel';

//eslint-disable-next-line
class UserCard extends React.Component {

  render() {
    const { user, onBookmarkClicked, bookmarked, shouldExpand } = this.props;
    const imageStyle = {
      backgroundImage: `url(${user.picture})`,
      cursor: 'pointer',
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      border: 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      margin: '0 auto',
    };

    const cardStyle = {
      borderRadius: '1%',
      position: 'relative',
      backgroundColor: 'white',
      padding: '0px 6px 6px 6px',
      border: '1px solid lightgray',
      height: `${shouldExpand ? '100%' : 'initial'}`,
    };
    return (
      <div className="grid-item" style={cardStyle}>

        <div onClick={onBookmarkClicked}>
          <img
            alt=""
            style={{width: '50px', float: 'left', margin: '-2px 0px 0px -5px', position: 'absolute'}}
            src={`/images/bookmark_${bookmarked ? 'active.svg' : 'inactive.svg'}`}
          />
        </div>

        <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <div style={{flex: 1, marginTop: '10px'}}>
            <div
              onClick={() => this.props.push(`/profile/${user._id}`)}
              style={imageStyle}
            />
            <div style={{clear: 'both', textAlign: 'center', whiteSpace: 'nowrap'}}>
              <h3 style={{textTransform: 'uppercase', letterSpacing: '4px', margin: '10px 0'}}>{user.name.split(' ')[0]}</h3>
              <h4 style={{fontSize: '14px'}}>{user.location}</h4>
            </div>
            <hr style={{borderTop: '1px dashed lightgray', margin: '0px -5px'}} />
            <SkillLabelContainer
              isInterestFunc={() => false}
              isSelectedFunc={() => true}
              onClick={skill => this.setState({ selectedSkill: skill._id })}
              skills={user.skills}
            />
          </div>
          <RequestButton user={user} />
        </div>
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
