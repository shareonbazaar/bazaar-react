import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import UserCard from './UserCard';


const masonryOptions = {
  gutter: 20,
  itemSelector: '.grid-item',
  fitWidth: true,
};

export default class CardGrid extends React.Component {
  componentWillMount() {
    this.props.loadUsers();
  }

  toggleBookmark(id) {
    const form = new FormData();
    const bookmarks = this.props.loggedInUser.bookmarks.slice();
    const index = bookmarks.indexOf(id);
    if (index < 0) {
      bookmarks.push(id);
    } else {
      bookmarks.splice(index, 1);
    }
    if (bookmarks.length === 0) {
      form.append('bookmarks', '');
    } else {
      bookmarks.forEach(b => form.append('bookmarks', b));
    }

    this.props.updateProfile(form);
  }

  render() {
    const { users, isFetching, loggedInUser } = this.props;
    if (!users || isFetching) {
      return (<div>Loading...</div>);
    }

    return (
      <div className="community-page">
        <Masonry className="user-list" options={masonryOptions}>
          {users.map(user => (
            <UserCard
              onBookmarkClicked={() => this.toggleBookmark(user._id)}
              key={user._id}
              user={user}
              bookmarked={loggedInUser.bookmarks.indexOf(user._id) >= 0}
            />
          ))
          }
        </Masonry>
      </div>
    );
  }
}

CardGrid.propTypes = {
  users: PropTypes.array,
  isFetching: PropTypes.bool,
  loadUsers: PropTypes.func,
  loggedInUser: PropTypes.object,
  bookmarkCard: PropTypes.func,
  updateProfile: PropTypes.func,
};

CardGrid.defaultProps = {
  users: [],
  isFetching: false,
  loadUsers: () => {},
  loggedInUser: {},
  bookmarkCard: () => {},
  updateProfile: () => {},
};
