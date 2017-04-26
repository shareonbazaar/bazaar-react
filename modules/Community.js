import React from 'react'
import UserCard from './UserCard'
import Masonry from 'react-masonry-component'
import { connect } from 'react-redux'
import { loadUsers, updateProfile } from '../utils/actions'


var masonryOptions = {
    gutter: 20,
    itemSelector: '.grid-item',
    fitWidth: true,
}

class Community extends React.Component {

    componentWillMount () {
        this.props.loadUsers()
    }

    render () {
        if (!this.props.users || this.props.isFetching) {
            return <div>Loading...</div>
        }
        return (
            <div className='community-page'>
                <Masonry className='user-list' options={masonryOptions}>
                    {this.props.users.map(user => <UserCard
                                                    onBookmarkClicked={() => this.props.bookmarkCard(user._id, this.props.loggedInUser)}
                                                    key={user._id}
                                                    user={user}
                                                    bookmarked={this.props.loggedInUser.bookmarks.indexOf(user._id) >= 0}
                                                 />)
                    }
                </Masonry>
            </div>
        )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    loadUsers: (data) => {
        dispatch(loadUsers(data));
    },
    bookmarkCard: (id, loggedInUser) => {
        let form = new FormData();
        var bookmarks = loggedInUser.bookmarks.slice();
        var index = bookmarks.indexOf(id);
        if (index < 0) {
            bookmarks.push(id);
        } else {
            bookmarks.splice(index, 1);
        }
        if (bookmarks.length === 0) {
            form.append('bookmarks', '')
        } else {
            bookmarks.forEach(b => form.append('bookmarks', b))
        }

        dispatch(updateProfile(form));
    }
  }
}

// These props come from the application's
// state when it is started
function mapStateToProps(state, ownProps) {
    return {
        users: state.users.items,
        isFetching: state.isFetching,
        loggedInUser: state.auth.user,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Community);
