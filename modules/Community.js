import Masonry from 'react-masonry-component';
import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';

import UserCard from './UserCard';
import { loadUsers, updateProfile } from '../utils/actions';


const masonryOptions = {
  gutter: 20,
  itemSelector: '.grid-item',
  fitWidth: true,
};

class Community extends React.Component {
  componentWillMount() {
    this.props.loadUsers();
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
              onBookmarkClicked={() => this.props.bookmarkCard(
                //eslint-disable-next-line
                user._id, loggedInUser
              )}
              key={
                //eslint-disable-next-line
                user._id
              }
              user={user}
              bookmarked={loggedInUser.bookmarks.indexOf(
                //eslint-disable-next-line
                user._id) >= 0
              }
            />
          ))
          }
        </Masonry>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUsers: (data) => {
      dispatch(loadUsers(data));
    },
    bookmarkCard: (id, loggedInUser) => {
      const form = new FormData();
      const bookmarks = loggedInUser.bookmarks.slice();
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
      dispatch(updateProfile(form));
    }
  };
}
Community.propTypes = {
  users: PropTypes.node,
  isFetching: PropTypes.bool,
  loadUsers: PropTypes.func,
  loggedInUser: PropTypes.node,
  bookmarkCard: PropTypes.func,
};

Community.defaultProps = {
  users: null,
  isFetching: false,
  loadUsers: () => {},
  loggedInUser: null,
  bookmarkCard: () => {},
};
// These props come from the application's
// state when it is started
// function mapStateToProps(state, ownProps) {
function mapStateToProps(state) {
  return {
    users: state.users.items,
    isFetching: state.isFetching,
    loggedInUser: state.auth.user,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Community);
