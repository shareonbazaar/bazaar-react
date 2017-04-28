import React from 'react'
import { Link } from 'react-router'
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
                <SideBarLink toLink='/contact' imageSrc='/images/help.png' text={'Contact'} />
                <SideBarLink onClick={() => { this.props.onLogout()}} toLink='#' imageSrc='/images/logout.png' text={'Logout'} />
            </ul>
        </div>
    )
  }
}

function mapDispatchToProps (dispatch) {
    return {
        onLogout: () => {
            dispatch(requestLogout())
        }
    }
}

function mapStateToProps (state) {
    return {
        userId: state.auth.user._id,
        isAuthenticated: state.auth.isAuthenticated,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
