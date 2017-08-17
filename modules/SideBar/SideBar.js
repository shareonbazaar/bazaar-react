import React from 'react';
import PropTypes from 'prop-types';
import { defineMessages, injectIntl } from 'react-intl';

import { connect } from 'react-redux';
import SideBarLink from '../SideBarLink/SideBarLink';
import { requestLogout } from '../../utils/actions';


const messages = defineMessages({
  bookmarks: {
    id: 'SideBar.bookmarks',
    defaultMessage: 'Bookmarks',
  },
  profile: {
    id: 'SideBar.profile',
    defaultMessage: 'Profile',
  },
  settings: {
    id: 'SideBar.settings',
    defaultMessage: 'Settings',
  },
  contact: {
    id: 'SideBar.contact',
    defaultMessage: 'Contact',
  },
  login: {
    id: 'SideBar.login',
    defaultMessage: 'Login',
  },
  logout: {
    id: 'SideBar.logout',
    defaultMessage: 'Logout',
  },
});


//eslint-disable-next-line
class SideBar extends React.Component {
  render() {
    const { user, isAuthenticated, toggled } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className={`sidebar-wrapper ${toggled ? 'toggled' : ''}`}>
        <ul className="sidebar-nav">
          {
            isAuthenticated &&
            <SideBarLink
              badgeNum={user.unreadTransactions.length > 0 ? user.unreadTransactions.length : null}
              toLink="/transactions"
              imageSrc="/images/chat.png"
              text={'Wallet'}
            />
          }
          {isAuthenticated && <SideBarLink toLink="/bookmarks" imageSrc="/images/bookmark_icon.png" text={formatMessage(messages.bookmarks)} />}
          {isAuthenticated && <SideBarLink toLink={`/profile/${user._id}`} imageSrc="/images/profile.png" text={formatMessage(messages.profile)} />}
          {isAuthenticated && <SideBarLink toLink="/settings/" imageSrc="/images/settings.png" text={formatMessage(messages.settings)} />}
          <SideBarLink toLink="/contact" imageSrc="/images/help.png" text={formatMessage(messages.contact)} />
          {!isAuthenticated && <SideBarLink toLink="/login" imageSrc="/images/logout.png" text={formatMessage(messages.login)} />}
          {isAuthenticated && <SideBarLink onClick={this.props.requestLogout} toLink="/" imageSrc="/images/logout.png" text={formatMessage(messages.logout)} />}
        </ul>
      </div>
    );
  }
}
SideBar.propTypes = {
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  requestLogout: PropTypes.func,
  toggled: PropTypes.bool,
  intl: PropTypes.object,
};

SideBar.defaultProps = {
  isAuthenticated: false,
  user: null,
  requestLogout: () => {},
  toggled: false,
  intl: null,
};

function mapStateToProps({ auth }) {
  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
  };
}

export default connect(mapStateToProps, { requestLogout })(injectIntl(SideBar));
