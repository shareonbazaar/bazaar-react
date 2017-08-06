import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SideBarLink from './SideBarLink';
import { requestLogout } from '../utils/actions';

//eslint-disable-next-line
class SideBar extends React.Component {
  render() {
    const { isAuthenticated, toggled, userId } = this.props;
    return (
      <div className={`sidebar-wrapper ${toggled ? 'toggled' : ''}`}>
        <ul className="sidebar-nav">
          {isAuthenticated && <SideBarLink toLink="/transactions" imageSrc="/images/chat.png" text={'Wallet'} />}
          {isAuthenticated && <SideBarLink toLink="/bookmarks" imageSrc="/images/bookmark_icon.png" text={'Bookmarks'} />}
          {isAuthenticated && <SideBarLink toLink={`/profile/${userId}`} imageSrc="/images/profile.png" text={'Profile'} />}
          {isAuthenticated && <SideBarLink toLink="/settings/" imageSrc="/images/settings.png" text={'Settings'} />}
          <SideBarLink toLink="/contact" imageSrc="/images/help.png" text={'Contact'} />
          {!isAuthenticated && <SideBarLink toLink="/login" imageSrc="/images/logout.png" text={'Login'} />}
          {isAuthenticated && <SideBarLink onClick={this.props.requestLogout} toLink="/" imageSrc="/images/logout.png" text={'Logout'} />}
        </ul>
      </div>
    );
  }
}
SideBar.propTypes = {
  isAuthenticated: PropTypes.bool,
  userId: PropTypes.string,
  requestLogout: PropTypes.func,
  toggled: PropTypes.bool,
};

SideBar.defaultProps = {
  isAuthenticated: false,
  userId: '',
  requestLogout: () => {},
  toggled: false,
};

function mapStateToProps(state) {
  return {
    userId: state.auth.user._id,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps, { requestLogout })(SideBar);
