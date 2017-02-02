import React from 'react'
import { Link } from 'react-router'
import SideBarLink from './SideBarLink'
import { connect } from 'react-redux'
import { requestLogout } from '../utils/actions'


class SideBar extends React.Component {
  render() {
    return (
    	<div className='sidebar-wrapper'>
    		<ul className='sidebar-nav'>
    			<SideBarLink toLink='/transactions' imageSrc='/images/chat.png' />
    			<SideBarLink toLink='/bookmarks' imageSrc='/images/bookmark_icon.png' />
                <SideBarLink toLink={'/profile/' + this.props.userId} imageSrc='/images/profile.png' />
                <SideBarLink onClick={() => { this.props.onLogout()}} toLink='#' imageSrc='/images/logout.png' />
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
        userId: state.auth.user._id
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
