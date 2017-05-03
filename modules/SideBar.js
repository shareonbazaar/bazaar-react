import React from 'react'
import SideBarLink from './SideBarLink'
import { connect } from 'react-redux'
import { requestLogout } from '../utils/actions'


class SideBar extends React.Component {
  render() {
    return (
        <div className={`sidebar-wrapper ${this.props.toggled ? 'toggled' : ''}`}>
            <ul className='sidebar-nav'>
                {this.props.isAuthenticated && <SideBarLink toLink='/transactions' imageSrc='/images/chat.png' text={'Wallet'} />}
                {this.props.isAuthenticated && <SideBarLink toLink='/bookmarks' imageSrc='/images/bookmark_icon.png' text={'Bookmarks'} />}
                {this.props.isAuthenticated && <SideBarLink toLink={'/profile/' + this.props.userId} imageSrc='/images/profile.png' text={'Profile'} />}
                {this.props.isAuthenticated && <SideBarLink toLink='/settings/' imageSrc='/images/settings.png' text={'Settings'} />}
                <SideBarLink toLink='/contact' imageSrc='/images/help.png' text={'Contact'} />
                {!this.props.isAuthenticated && <SideBarLink toLink='/login' imageSrc='/images/logout.png' text={'Login'} />}
                {this.props.isAuthenticated && <SideBarLink onClick={this.props.requestLogout} toLink='/' imageSrc='/images/logout.png' text={'Logout'} />}
            </ul>
        </div>
    )
  }
}

function mapStateToProps (state) {
    return {
        userId: state.auth.user._id,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

export default connect(mapStateToProps, {requestLogout})(SideBar);
