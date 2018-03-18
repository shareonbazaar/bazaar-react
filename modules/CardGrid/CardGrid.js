import React from 'react';
import PropTypes from 'prop-types';
import Masonry from 'react-masonry-component';
import UserCard from '../UserCard/UserCard';


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

  renderUsers() {
    const { users, loggedInUser } = this.props;
    return (
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
    );
  }

  renderEmptyPage() {
    const { localizedMessages } = this.props;
    const { formatMessage } = this.props.intl;
    return (
      <div className="empty-card-grid">
        <p>
          {formatMessage(localizedMessages.noUsersMessage)}
        </p>
      </div>
    );
  }

  render() {
    const { users, isFetching } = this.props;
    if (!users || isFetching) {
      return (<div>Loading...</div>);
    }

    return (
      <div className="community-page">
        {
          users.length > 0 ? this.renderUsers() : this.renderEmptyPage()
        }
      </div>
    );
  }
}

CardGrid.propTypes = {
  users: PropTypes.array,
  isFetching: PropTypes.bool,
  loadUsers: PropTypes.func.isRequired,
  loggedInUser: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
  localizedMessages: PropTypes.object,
  intl: PropTypes.object.isRequired,
};

CardGrid.defaultProps = {
  users: [],
  isFetching: false,
  localizedMessages: {},
};
