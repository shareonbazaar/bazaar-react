import React from 'react'
import SideBarLink from './SideBarLink'
import { connect } from 'react-redux'
import { requestLogout } from '../utils/actions'


class SideBar extends React.Component {
  render() {
    const { user, isAuthenticated } = this.props;
    return (
        <div className={`sidebar-wrapper ${this.props.toggled ? 'toggled' : ''}`}>
            <ul className='sidebar-nav'>
                {
                    isAuthenticated &&
                    <SideBarLink
                        badgeNum={user.unreadTransactions.length > 0 ? user.unreadTransactions.length : null}
                        toLink='/transactions'
                        imageSrc='/images/chat.png'
                        text={'Wallet'}
                    />
                }
                {isAuthenticated && <SideBarLink toLink='/bookmarks' imageSrc='/images/bookmark_icon.png' text={'Bookmarks'} />}
                {isAuthenticated && <SideBarLink toLink={`/profile/${user._id}`} imageSrc='/images/profile.png' text={'Profile'} />}
                {isAuthenticated && <SideBarLink toLink='/settings/' imageSrc='/images/settings.png' text={'Settings'} />}
                <SideBarLink toLink='/contact' imageSrc='/images/help.png' text={'Contact'} />
                {!isAuthenticated && <SideBarLink toLink='/login' imageSrc='/images/logout.png' text={'Login'} />}
                {isAuthenticated && <SideBarLink onClick={this.props.requestLogout} toLink='/' imageSrc='/images/logout.png' text={'Logout'} />}
            </ul>
        </div>
    )
  }
}

function mapStateToProps (state) {
    return {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

export default connect(mapStateToProps, {requestLogout})(SideBar);
