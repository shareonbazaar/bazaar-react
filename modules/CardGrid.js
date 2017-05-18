import React from 'react'
import UserCard from './UserCard'
import Masonry from 'react-masonry-component'

var masonryOptions = {
    gutter: 20,
    itemSelector: '.grid-item',
    fitWidth: true,
}

export default class CardGrid extends React.Component {

    componentWillMount () {
        this.props.loadUsers()
    }

    toggleBookmark (id) {
        let form = new FormData();
        var bookmarks = this.props.loggedInUser.bookmarks.slice();
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

        this.props.updateProfile(form);
    }

    render () {
        if (!this.props.users || this.props.isFetching) {
            return <div>Loading...</div>
        }
        return (
            <div className='community-page'>
                <Masonry className='user-list' options={masonryOptions}>
                    {this.props.users.map(user => <UserCard
                                                    onBookmarkClicked={() => this.toggleBookmark(user._id)}
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
